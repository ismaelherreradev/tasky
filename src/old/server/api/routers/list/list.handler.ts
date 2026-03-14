import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, exists } from "drizzle-orm";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards, cards, type EntityType, lists } from "~/server/db/schema";

import { createCrudHandlers } from "../../shared/crud-handler";
import { validateOrgId } from "../../shared/db-utils";
import type * as Schema from "./list.schema";

type List<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

const listCrud = createCrudHandlers({
  table: lists,
  entityType: "LIST" as EntityType,
  entityName: "List",
  nestedOrgAccessCondition: (ctx: ProtectedTRPCContext) => {
    const orgId = ctx.auth.orgId;
    if (!orgId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Organization access required",
      });
    }
    return exists(
      ctx.db
        .select()
        .from(boards)
        .where(and(eq(boards.id, lists.boardId), eq(boards.orgId, orgId))),
    );
  },
});

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

async function getLastListOrder(
  ctx: ProtectedTRPCContext,
  boardId: number,
): Promise<number> {
  const lastList = await ctx.db.query.lists.findFirst({
    where: eq(lists.boardId, boardId),
    orderBy: [desc(lists.createdAt)],
    columns: { order: true },
  });
  return lastList ? lastList.order + 1 : 1;
}

export async function updateListOrder({
  ctx,
  input,
}: List<Schema.TUpdateListOrder>) {
  const { items } = input;

  if (!items) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Items not found" });
  }

  await listCrud.batchUpdate(
    ctx,
    items.map((list) => ({
      id: list.id,
      order: list.order,
    })),
  );
}

export async function createList({ input, ctx }: List<Schema.TCreateList>) {
  const { title, boardId } = input;
  const orgId = await validateOrgId(ctx);

  await validateBoardAccess(ctx, boardId, orgId);

  const result = await listCrud.create(
    ctx,
    { title, boardId },
    {
      getNextOrder: async (ctx, data) => {
        const listData = data as { boardId: number };
        return getLastListOrder(ctx, listData.boardId);
      },
    },
  );

  return result;
}

export async function getlistsWithCards({
  ctx,
  input,
}: List<Schema.TGetlistsWithCards>) {
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

  const newOrder = await getLastListOrder(ctx, boardId);

  const newList = await listCrud.create(ctx, {
    boardId: listToCopy.boardId,
    title: `${listToCopy.title} - Copy`,
    order: newOrder,
  });

  if (!newList || typeof newList.id !== "number") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Failed to create new list",
    });
  }

  const cardData = listToCopy.cards.map((card) => ({
    listId: newList.id as number,
    title: card.title,
    description: card.description,
    order: card.order,
  }));

  await ctx.db.insert(cards).values(cardData);

  return newList;
}

export async function deleteList({ ctx, input }: List<Schema.TDeleteList>) {
  const { listId, boardId } = input;
  const orgId = await validateOrgId(ctx);

  await validateBoardAccess(ctx, boardId, orgId);

  const result = await listCrud.delete(ctx, listId);
  return result;
}

export async function updateList({ ctx, input }: List<Schema.TUpdateList>) {
  const { title, listId, boardId } = input;
  const orgId = await validateOrgId(ctx);

  if (typeof boardId !== "number") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid board ID" });
  }
  if (typeof listId !== "number") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid list ID" });
  }

  await validateBoardAccess(ctx, boardId, orgId);

  const result = await listCrud.update(ctx, listId, { title });
  return result;
}

export async function getListById({ ctx, input }: List<Schema.TGetListById>) {
  const { id } = input;

  const list = await ctx.db.query.lists.findFirst({
    where: eq(lists.id, id),
  });

  if (!list) {
    throw new TRPCError({ code: "NOT_FOUND", message: "List not found" });
  }

  return list;
}

export async function getListsByBoardId({
  ctx,
  input,
}: List<Schema.TGetListsByBoardId>) {
  const { boardId } = input;

  const list = await ctx.db.query.lists.findMany({
    where: eq(lists.boardId, boardId),
  });

  return list ?? null;
}
