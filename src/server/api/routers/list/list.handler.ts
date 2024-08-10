import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards, cards, lists, type Action, type EntityType } from "~/server/db/schema";
import { and, asc, desc, eq, exists } from "drizzle-orm";

import { createAuditLog, validateOrgId } from "../../utils";
import type * as Schema from "./list.schema";

type List<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

async function validateBoardAccess(
  ctx: ProtectedTRPCContext,
  boardId: number,
  orgId: string,
): Promise<void> {
  const board = await ctx.db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.orgId, orgId)),
  });
  if (!board) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Board not found" });
  }
}

export async function updateListOrder({ ctx, input }: List<Schema.TUpdateListOrder>) {
  const { items } = input;
  const orgId = await validateOrgId(ctx);

  if (!items || !orgId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Items not found" });
  }

  const updates = items.map((list) =>
    ctx.db
      .update(lists)
      .set({ order: list.order })
      .where(
        and(
          eq(lists.id, list.id),
          exists(
            ctx.db
              .select()
              .from(boards)
              .where(and(eq(boards.id, lists.boardId), eq(boards.orgId, orgId))),
          ),
        ),
      ),
  );

  await ctx.db.transaction(async (tx) => {
    for (const update of updates) {
      await tx.run(update);
    }
  });
}

export async function createList({ input, ctx }: List<Schema.TCreateList>) {
  const { title, boardId } = input;
  const orgId = await validateOrgId(ctx);
  await validateBoardAccess(ctx, boardId, orgId);

  const lastList = await ctx.db.query.lists.findFirst({
    where: eq(lists.boardId, boardId),
    orderBy: [desc(lists.createdAt)],
    columns: {
      order: true,
    },
  });

  const newOrder = lastList ? lastList.order + 1 : 1;

  const [list] = await ctx.db
    .insert(lists)
    .values({
      title,
      boardId,
      order: newOrder,
    })
    .returning();

  if (list) {
    await createAuditLog({
      orgId,
      action: "CREATE" as Action,
      entityId: list.id,
      entityType: "LIST" as EntityType,
      entityTitle: list.title,
    });
  }

  return list ?? null;
}

export async function getlistsWithCards({ ctx, input }: List<Schema.TGetlistsWithCards>) {
  const { boardId } = input;
  const orgId = await validateOrgId(ctx);

  const listsWithCards = await ctx.db.query.lists.findMany({
    where: (lists, { eq, and, exists }) =>
      and(
        eq(lists.boardId, boardId),
        exists(
          ctx.db
            .select()
            .from(boards)
            .where(and(eq(boards.id, lists.boardId), eq(boards.orgId, orgId))),
        ),
      ),
    with: {
      cards: {
        orderBy: [asc(cards.order)],
      },
    },
    orderBy: [asc(lists.order)],
  });

  return listsWithCards ?? null;
}

export async function copyList({ ctx, input }: List<Schema.TCopyList>) {
  const { listId, boardId } = input;
  const orgId = await validateOrgId(ctx);
  await validateBoardAccess(ctx, boardId, orgId);

  const listToCopy = await ctx.db.query.lists.findFirst({
    where: (lists, { eq, and, exists }) =>
      and(
        eq(lists.id, listId),
        eq(lists.boardId, boardId),
        exists(
          ctx.db
            .select()
            .from(boards)
            .where(and(eq(boards.id, lists.boardId), eq(boards.orgId, orgId))),
        ),
      ),
    with: {
      cards: true,
    },
  });

  if (!listToCopy) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "List not found" });
  }

  const lastList = await ctx.db.query.lists.findFirst({
    where: eq(lists.boardId, boardId),
    orderBy: [desc(lists.createdAt)],
    columns: {
      order: true,
    },
  });

  const newOrder = lastList ? lastList.order + 1 : 1;

  const [newList] = await ctx.db
    .insert(lists)
    .values({
      boardId: listToCopy.boardId,
      title: `${listToCopy.title} - Copy`,
      order: newOrder,
    })
    .returning();

  if (!newList?.id) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "List not found" });
  }

  const cardData = listToCopy.cards.map((card) => ({
    listId: newList.id,
    title: card.title,
    description: card.description,
    order: card.order,
  }));

  await ctx.db.insert(cards).values(cardData);

  const [list] = await ctx.db
    .select()
    .from(lists)
    .where(eq(lists.id, newList.id))
    .leftJoin(cards, eq(cards.listId, lists.id));

  if (list?.list) {
    await createAuditLog({
      orgId,
      action: "CREATE" as Action,
      entityId: list.list.id,
      entityType: "LIST" as EntityType,
      entityTitle: list.list.title,
    });
  }

  return list?.list ?? null;
}

export async function deleteList({ ctx, input }: List<Schema.TDeleteList>) {
  const { listId, boardId } = input;
  const orgId = await validateOrgId(ctx);
  await validateBoardAccess(ctx, boardId, orgId);

  const [list] = await ctx.db
    .delete(lists)
    .where(
      and(
        eq(lists.id, listId),
        eq(lists.boardId, boardId),
        exists(
          ctx.db
            .select()
            .from(boards)
            .where(and(eq(boards.id, lists.boardId), eq(boards.orgId, orgId))),
        ),
      ),
    )
    .returning();

  if (list) {
    await createAuditLog({
      orgId,
      action: "DELETE" as Action,
      entityId: list.id,
      entityType: "LIST" as EntityType,
      entityTitle: list.title,
    });
  }

  return list ?? null;
}

export async function updateList({ ctx, input }: List<Schema.TUpdateList>) {
  const { title, listId, boardId } = input;
  const orgId = await validateOrgId(ctx);
  await validateBoardAccess(ctx, boardId, orgId);

  const [list] = await ctx.db
    .update(lists)
    .set({
      title: title,
    })
    .where(
      and(
        eq(lists.id, listId),
        eq(lists.boardId, boardId),
        exists(
          ctx.db
            .select()
            .from(boards)
            .where(and(eq(boards.id, lists.boardId), eq(boards.orgId, orgId))),
        ),
      ),
    )
    .returning();

  if (list) {
    await createAuditLog({
      orgId,
      action: "UPDATE" as Action,
      entityId: list.id,
      entityType: "LIST" as EntityType,
      entityTitle: list.title,
    });
  }

  return list ?? null;
}

export async function getListById({ ctx, input }: List<Schema.TGetListById>) {
  const { id } = input;
  const orgId = await validateOrgId(ctx);

  const list = await ctx.db.query.lists.findFirst({
    where: eq(lists.id, id),
  });

  if (!list) {
    throw new TRPCError({ code: "NOT_FOUND", message: "List not found" });
  }

  return list ?? null;
}

export async function getListsByBoardId({ ctx, input }: List<Schema.TGetListsByBoardId>) {
  const { boardId } = input;
  const orgId = await validateOrgId(ctx);

  const list = await ctx.db.query.lists.findMany({
    where: eq(lists.boardId, boardId),
  });

  return list ?? null;
}
