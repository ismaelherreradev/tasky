import {
  type AnyColumn,
  and,
  asc,
  desc,
  eq,
  exists,
  type SQL,
  sql,
} from "drizzle-orm";
import type { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";
import type { ProtectedTRPCContext } from "~/server/api/trpc";

type AnyDrizzleTable = SQLiteTable<TableConfig>;

export type SortOrder = "asc" | "desc";

export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export type SortOptions<T extends Record<string, AnyColumn>> = {
  sortBy?: keyof T;
  sortOrder?: SortOrder;
};

export type QueryOptions<T extends Record<string, AnyColumn>> =
  PaginationOptions & SortOptions<T>;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
} as const;

export const MAX_LIMIT = 100;

export const normalizePagination = (
  options: PaginationOptions = {},
): Required<PaginationOptions> => {
  const page = Math.max(1, options.page ?? DEFAULT_PAGINATION.page);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, options.limit ?? DEFAULT_PAGINATION.limit),
  );

  return { page, limit };
};

export const createPaginationClause = (options: PaginationOptions = {}) => {
  const { page, limit } = normalizePagination(options);
  const offset = (page - 1) * limit;

  return {
    limit,
    offset,
  };
};

export const createSortClause = <T extends Record<string, AnyColumn>>(
  table: T,
  options: SortOptions<T> = {},
) => {
  const { sortBy, sortOrder = "desc" } = options;

  if (!sortBy || !(sortBy in table) || !table.createdAt) {
    return table.createdAt ? [desc(table.createdAt)] : [];
  }

  const column = table[sortBy];
  return column ? (sortOrder === "asc" ? [asc(column)] : [desc(column)]) : [];
};

export const buildOrgAccessCondition = <T extends AnyDrizzleTable>(
  table: T,
  orgId: string,
): SQL => {
  const orgIdColumn = (table as Record<string, unknown>).orgId as Parameters<
    typeof eq
  >[0];
  return eq(orgIdColumn, orgId);
};

export const buildNestedOrgAccessCondition = <U extends AnyDrizzleTable>(
  ctx: ProtectedTRPCContext,
  joinTable: U,
  joinCondition: SQL,
): SQL => {
  const orgId = ctx.auth.orgId;
  if (!orgId) {
    throw new Error("Organization ID is required");
  }
  const orgIdColumn = (joinTable as Record<string, unknown>)
    .orgId as Parameters<typeof eq>[0];

  return exists(
    ctx.db
      .select()
      .from(joinTable)
      .where(and(joinCondition, eq(orgIdColumn, orgId))),
  );
};

export const combineConditions = (
  ...conditions: (SQL | undefined)[]
): SQL | undefined => {
  const validConditions = conditions.filter((c): c is SQL => c !== undefined);

  if (validConditions.length === 0) return undefined;
  if (validConditions.length === 1) return validConditions[0];

  return and(...validConditions);
};

export const createBaseQuery = <T extends AnyDrizzleTable>(
  ctx: ProtectedTRPCContext,
  table: T,
) => ctx.db.select().from(table);

type DrizzleQuery = {
  where: (condition: SQL) => DrizzleQuery;
  orderBy: (...args: SQL[]) => DrizzleQuery;
  limit: (n: number) => DrizzleQuery;
  offset: (n: number) => DrizzleQuery;
};

export const applyWhereClause = <Q extends DrizzleQuery>(
  query: Q,
  condition?: SQL,
): Q => {
  if (condition) {
    return query.where(condition) as Q;
  }
  return query;
};

export const applyOrderBy = <Q extends DrizzleQuery>(
  query: Q,
  orderClauses: SQL[],
): Q => {
  if (orderClauses.length > 0) {
    return query.orderBy(...orderClauses) as Q;
  }
  return query;
};

export const applyPagination = <Q extends DrizzleQuery>(
  query: Q,
  options: PaginationOptions = {},
): Q => {
  const { limit, offset } = createPaginationClause(options);
  return query.limit(limit).offset(offset) as Q;
};

export const createOptimizedQuery = <T extends AnyDrizzleTable>(
  ctx: ProtectedTRPCContext,
  table: T,
  options: {
    where?: SQL;
    sort?: SortOptions<Record<string, AnyColumn>>;
    pagination?: PaginationOptions;
  } = {},
) => {
  let query: ReturnType<typeof createBaseQuery> = createBaseQuery(ctx, table);

  if (options.where) {
    query = query.where(options.where) as unknown as typeof query;
  }

  const sortClauses = createSortClause(
    table as unknown as Record<string, AnyColumn>,
    options.sort,
  );
  if (sortClauses.length > 0) {
    query = query.orderBy(...sortClauses) as unknown as typeof query;
  }

  if (options.pagination) {
    const { limit, offset } = createPaginationClause(options.pagination);
    query = query.limit(limit).offset(offset) as unknown as typeof query;
  }

  return query;
};

export const createCountQuery = <T extends AnyDrizzleTable>(
  ctx: ProtectedTRPCContext,
  table: T,
  condition?: SQL,
) => {
  const query = ctx.db.select({ count: sql<number>`count(*)` }).from(table);
  return condition ? query.where(condition) : query;
};

export const withPaginationMeta = async <T>(
  dataQuery: Promise<T[]>,
  countQuery: Promise<{ count: number }[]>,
  options: PaginationOptions = {},
) => {
  const [data, countResult] = await Promise.all([dataQuery, countQuery]);
  const total = Number(countResult[0]?.count ?? 0);
  const { page, limit } = normalizePagination(options);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export const createBatchQuery = <T extends { id: number }>(
  ctx: ProtectedTRPCContext,
  queries: Promise<T>[],
) => {
  return ctx.db.transaction(async () => {
    return await Promise.all(queries);
  });
};

export const optimizeInClause = <T>(values: T[]): T[] => {
  if (values.length <= 1000) return values;
  return values.slice(0, 1000);
};
