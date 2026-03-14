import { TRPCError } from "@trpc/server";
import { and, desc, eq, type SQL } from "drizzle-orm";
import type { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import type { Action, EntityType } from "~/server/db/schema";

import { createAuditLog, validateOrgId } from "./db-utils";

type AnyTable = SQLiteTable<TableConfig>;

export type CrudOptions = {
  table: AnyTable;
  entityType: EntityType;
  entityName: string;
  orgAccessCondition?: (orgId: string) => SQL;
  nestedOrgAccessCondition?: (ctx: ProtectedTRPCContext) => SQL;
};

export type CreateOptions = {
  getNextOrder?: (
    ctx: ProtectedTRPCContext,
    data: Record<string, unknown>,
  ) => Promise<number>;
  beforeCreate?: (
    ctx: ProtectedTRPCContext,
    data: Record<string, unknown>,
  ) => Promise<void>;
  afterCreate?: (
    ctx: ProtectedTRPCContext,
    entity: Record<string, unknown>,
  ) => Promise<void>;
};

export type UpdateOptions = {
  beforeUpdate?: (
    ctx: ProtectedTRPCContext,
    id: number,
    data: Record<string, unknown>,
  ) => Promise<void>;
  afterUpdate?: (
    ctx: ProtectedTRPCContext,
    entity: Record<string, unknown>,
  ) => Promise<void>;
};

export type DeleteOptions = {
  beforeDelete?: (ctx: ProtectedTRPCContext, id: number) => Promise<void>;
  afterDelete?: (
    ctx: ProtectedTRPCContext,
    entity: Record<string, unknown>,
  ) => Promise<void>;
};

export type ListOptions = {
  defaultOrderBy?: SQL[];
  relations?: Record<string, boolean>;
};

export async function createEntity(
  ctx: ProtectedTRPCContext,
  data: Record<string, unknown>,
  baseOptions: CrudOptions,
  options: CreateOptions = {},
) {
  const { table, entityType, entityName } = baseOptions;
  const orgId = await validateOrgId(ctx);

  if (options.beforeCreate) {
    await options.beforeCreate(ctx, data);
  }

  let insertData = { ...data };

  if (options.getNextOrder) {
    const order = await options.getNextOrder(ctx, data);
    insertData = { ...insertData, order };
  }

  const result = await ctx.db.insert(table).values(insertData).returning();
  const entity = Array.isArray(result) ? result[0] : result;

  if (!entity) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to create ${entityName}`,
    });
  }

  const entityId = entity.id as number;
  const entityTitle =
    (entity.title as string) ??
    (entity.name as string) ??
    `${entityName} ${entityId}`;

  await createAuditLog(ctx, {
    orgId,
    action: "CREATE" as Action,
    entityId,
    entityType,
    entityTitle,
  });

  if (options.afterCreate) {
    await options.afterCreate(ctx, entity);
  }

  return entity;
}

export async function updateEntity(
  ctx: ProtectedTRPCContext,
  id: number,
  data: Record<string, unknown>,
  baseOptions: CrudOptions,
  options: UpdateOptions = {},
) {
  const { table, entityType, entityName } = baseOptions;
  const orgId = await validateOrgId(ctx);

  if (options.beforeUpdate) {
    await options.beforeUpdate(ctx, id, data);
  }

  let whereCondition = eq(
    (table as unknown as { id: AnyTable["_"]["columns"]["id"] }).id,
    id,
  );

  if (baseOptions.orgAccessCondition) {
    const orgCondition = baseOptions.orgAccessCondition(orgId);
    whereCondition = and(whereCondition, orgCondition) ?? whereCondition;
  } else if (baseOptions.nestedOrgAccessCondition) {
    const nestedCondition = baseOptions.nestedOrgAccessCondition(ctx);
    whereCondition = and(whereCondition, nestedCondition) ?? whereCondition;
  }

  const result = await ctx.db
    .update(table)
    .set(data)
    .where(whereCondition)
    .returning();
  const entity = Array.isArray(result) ? result[0] : result;

  if (!entity) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `${entityName} not found`,
    });
  }

  const entityId = entity.id as number;
  const entityTitle =
    (entity.title as string) ??
    (entity.name as string) ??
    `${entityName} ${entityId}`;

  await createAuditLog(ctx, {
    orgId,
    action: "UPDATE" as Action,
    entityId,
    entityType,
    entityTitle,
  });

  if (options.afterUpdate) {
    await options.afterUpdate(ctx, entity);
  }

  return entity;
}

export async function deleteEntity(
  ctx: ProtectedTRPCContext,
  id: number,
  baseOptions: CrudOptions,
  options: DeleteOptions = {},
) {
  const { table, entityType, entityName } = baseOptions;
  const orgId = await validateOrgId(ctx);

  if (options.beforeDelete) {
    await options.beforeDelete(ctx, id);
  }

  let whereCondition = eq(
    (table as unknown as { id: AnyTable["_"]["columns"]["id"] }).id,
    id,
  );

  if (baseOptions.orgAccessCondition) {
    const orgCondition = baseOptions.orgAccessCondition(orgId);
    whereCondition = and(whereCondition, orgCondition) ?? whereCondition;
  } else if (baseOptions.nestedOrgAccessCondition) {
    const nestedCondition = baseOptions.nestedOrgAccessCondition(ctx);
    whereCondition = and(whereCondition, nestedCondition) ?? whereCondition;
  }

  const result = await ctx.db.delete(table).where(whereCondition).returning();
  const entity = Array.isArray(result) ? result[0] : result;

  if (!entity) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `${entityName} not found`,
    });
  }

  const entityId = entity.id as number;
  const entityTitle =
    (entity.title as string) ??
    (entity.name as string) ??
    `${entityName} ${entityId}`;

  await createAuditLog(ctx, {
    orgId,
    action: "DELETE" as Action,
    entityId,
    entityType,
    entityTitle,
  });

  if (options.afterDelete) {
    await options.afterDelete(ctx, entity);
  }

  return entity;
}

export async function findEntityById(
  ctx: ProtectedTRPCContext,
  id: number,
  baseOptions: CrudOptions,
) {
  const { table } = baseOptions;
  const orgId = await validateOrgId(ctx);

  let whereCondition = eq(
    (table as unknown as { id: AnyTable["_"]["columns"]["id"] }).id,
    id,
  );

  if (baseOptions.orgAccessCondition) {
    const orgCondition = baseOptions.orgAccessCondition(orgId);
    whereCondition = and(whereCondition, orgCondition) ?? whereCondition;
  } else if (baseOptions.nestedOrgAccessCondition) {
    const nestedCondition = baseOptions.nestedOrgAccessCondition(ctx);
    whereCondition = and(whereCondition, nestedCondition) ?? whereCondition;
  }

  const result = await ctx.db
    .select()
    .from(table)
    .where(whereCondition)
    .limit(1);

  return (Array.isArray(result) ? result[0] : result) ?? null;
}

export async function findManyEntities(
  ctx: ProtectedTRPCContext,
  condition: SQL | undefined,
  baseOptions: CrudOptions,
  options: ListOptions = {},
) {
  const { table } = baseOptions;
  const orgId = await validateOrgId(ctx);

  let whereCondition = condition;

  if (baseOptions.orgAccessCondition) {
    const orgCondition = baseOptions.orgAccessCondition(orgId);
    whereCondition = whereCondition
      ? and(whereCondition, orgCondition)
      : orgCondition;
  } else if (baseOptions.nestedOrgAccessCondition) {
    const nestedCondition = baseOptions.nestedOrgAccessCondition(ctx);
    whereCondition = whereCondition
      ? and(whereCondition, nestedCondition)
      : nestedCondition;
  }

  const query = ctx.db.select().from(table);

  if (whereCondition) {
    query.where(whereCondition);
  }

  if (options.defaultOrderBy && options.defaultOrderBy.length > 0) {
    query.orderBy(...options.defaultOrderBy);
  } else {
    const tableWithCreatedAt = table as unknown as {
      createdAt?: Parameters<typeof desc>[0];
    };
    if (tableWithCreatedAt.createdAt) {
      query.orderBy(desc(tableWithCreatedAt.createdAt));
    }
  }

  return await query;
}

export async function batchUpdateEntities(
  ctx: ProtectedTRPCContext,
  items: Array<{ id: number } & Record<string, unknown>>,
  baseOptions: CrudOptions,
) {
  const { table } = baseOptions;
  const orgId = await validateOrgId(ctx);

  const updates = items.map((item) => {
    const { id, ...data } = item;
    let whereCondition = eq(
      (table as unknown as { id: AnyTable["_"]["columns"]["id"] }).id,
      id,
    );

    if (baseOptions.orgAccessCondition) {
      const orgCondition = baseOptions.orgAccessCondition(orgId);
      whereCondition = and(whereCondition, orgCondition) ?? whereCondition;
    } else if (baseOptions.nestedOrgAccessCondition) {
      const nestedCondition = baseOptions.nestedOrgAccessCondition(ctx);
      whereCondition = and(whereCondition, nestedCondition) ?? whereCondition;
    }

    return ctx.db.update(table).set(data).where(whereCondition);
  });

  await ctx.db.transaction(async (tx) => {
    await Promise.all(updates.map((update) => tx.run(update)));
  });
}

export function createCrudHandlers(baseOptions: CrudOptions) {
  return {
    create: (
      ctx: ProtectedTRPCContext,
      data: Record<string, unknown>,
      options: CreateOptions = {},
    ) => createEntity(ctx, data, baseOptions, options),

    update: (
      ctx: ProtectedTRPCContext,
      id: number,
      data: Record<string, unknown>,
      options: UpdateOptions = {},
    ) => updateEntity(ctx, id, data, baseOptions, options),

    delete: (
      ctx: ProtectedTRPCContext,
      id: number,
      options: DeleteOptions = {},
    ) => deleteEntity(ctx, id, baseOptions, options),

    findById: (ctx: ProtectedTRPCContext, id: number) =>
      findEntityById(ctx, id, baseOptions),

    findMany: (
      ctx: ProtectedTRPCContext,
      condition?: SQL,
      options: ListOptions = {},
    ) => findManyEntities(ctx, condition, baseOptions, options),

    batchUpdate: (
      ctx: ProtectedTRPCContext,
      items: Array<{ id: number } & Record<string, unknown>>,
    ) => batchUpdateEntities(ctx, items, baseOptions),
  };
}
