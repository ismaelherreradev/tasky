import { TRPCError } from "@trpc/server"
import { and, eq, exists } from "drizzle-orm"

import { boards, cards, type EntityType, lists } from "#/server/db/schema"

import type { ProtectedTRPCContext } from "../../init"
import { createAuditLog, validateOrgId } from "../../shared/db-utils"
import type * as Schema from "./list.schema"

type List<T> = {
  ctx: ProtectedTRPCContext
  input: T
}

const listEntity: EntityType = "LIST"

async function validateBoardAccess(
  ctx: ProtectedTRPCContext,
  boardId: number,
  orgId: string,
): Promise<void> {
  const board = await ctx.db.query.boards.findFirst({
    where: {
      id: boardId,
      orgId,
    },
  })
  if (!board) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Board not found" })
  }
}

async function getLastListOrder(ctx: ProtectedTRPCContext, boardId: number): Promise<number> {
  const lastList = await ctx.db.query.lists.findFirst({
    where: {
      boardId,
    },
    orderBy: { createdAt: "desc" },
    columns: { order: true },
  })
  return lastList ? lastList.order + 1 : 1
}

async function ensureListOrgAccess(ctx: ProtectedTRPCContext, listId: number, orgId: string) {
  const list = await ctx.db
    .select({ id: lists.id, title: lists.title })
    .from(lists)
    .where(
      and(
        eq(lists.id, listId),
        exists(
          ctx.db
            .select()
            .from(boards)
            .where(and(eq(boards.id, lists.boardId), eq(boards.orgId, orgId))),
        ),
      ),
    )
    .get()

  if (!list) {
    throw new TRPCError({ code: "NOT_FOUND", message: "List not found" })
  }

  return list
}

export async function updateListOrder({ ctx, input }: List<Schema.TUpdateListOrder>) {
  const { items } = input

  if (!items) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Items not found" })
  }

  const orgId = await validateOrgId(ctx)

  await Promise.all(
    items.map(async (list) => {
      await ctx.db
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
        )
    }),
  )
}

export async function createList({ input, ctx }: List<Schema.TCreateList>) {
  const { title, boardId, color } = input
  const orgId = await validateOrgId(ctx)

  await validateBoardAccess(ctx, boardId, orgId)

  const order = await getLastListOrder(ctx, boardId)

  const result = await ctx.db.insert(lists).values({ title, boardId, order, color }).returning()

  const list = result[0]
  if (!list) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create list" })
  }

  await createAuditLog(ctx, {
    orgId,
    action: "CREATE",
    entityId: list.id,
    entityType: listEntity,
    entityTitle: list.title ?? `List ${list.id}`,
  })

  return list
}

export async function getlistsWithCards({ ctx, input }: List<Schema.TGetlistsWithCards>) {
  const { boardId } = input
  const orgId = await validateOrgId(ctx)

  const listsWithCards = await ctx.db.query.lists.findMany({
    where: {
      boardId,
      board: {
        orgId,
      },
    },
    with: {
      cards: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  })

  return listsWithCards ?? null
}

export async function copyList({ ctx, input }: List<Schema.TCopyList>) {
  const { listId, boardId } = input
  const orgId = await validateOrgId(ctx)

  await validateBoardAccess(ctx, boardId, orgId)

  const listToCopy = await ctx.db.query.lists.findFirst({
    where: {
      id: listId,
      boardId,
      board: {
        orgId,
      },
    },
    with: {
      cards: true,
    },
  })

  if (!listToCopy) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "List not found" })
  }

  const newOrder = await getLastListOrder(ctx, boardId)

  const newListResult = await ctx.db
    .insert(lists)
    .values({
      boardId: listToCopy.boardId,
      title: `${listToCopy.title} - Copy`,
      order: newOrder,
    })
    .returning()

  const newList = newListResult[0]

  if (!newList || typeof newList.id !== "number") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Failed to create new list",
    })
  }

  const cardData = listToCopy.cards.map((card) => ({
    listId: newList.id,
    title: card.title,
    description: card.description,
    order: card.order,
  }))

  await ctx.db.insert(cards).values(cardData)

  await createAuditLog(ctx, {
    orgId,
    action: "CREATE",
    entityId: newList.id,
    entityType: listEntity,
    entityTitle: newList.title ?? `List ${newList.id}`,
  })

  return newList
}

export async function deleteList({ ctx, input }: List<Schema.TDeleteList>) {
  const { listId, boardId } = input
  const orgId = await validateOrgId(ctx)

  await validateBoardAccess(ctx, boardId, orgId)

  const list = await ensureListOrgAccess(ctx, listId, orgId)

  const result = await ctx.db.delete(lists).where(eq(lists.id, listId)).returning()
  const deleted = result[0]

  if (!deleted) {
    throw new TRPCError({ code: "NOT_FOUND", message: "List not found" })
  }

  await createAuditLog(ctx, {
    orgId,
    action: "DELETE",
    entityId: list.id,
    entityType: listEntity,
    entityTitle: list.title ?? `List ${list.id}`,
  })

  return deleted
}

export async function updateList({ ctx, input }: List<Schema.TUpdateList>) {
  const { title, listId, boardId, color } = input
  const orgId = await validateOrgId(ctx)

  if (typeof boardId !== "number") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid board ID" })
  }
  if (typeof listId !== "number") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid list ID" })
  }

  await validateBoardAccess(ctx, boardId, orgId)

  await ensureListOrgAccess(ctx, listId, orgId)

  const result = await ctx.db
    .update(lists)
    .set({ title, color })
    .where(eq(lists.id, listId))
    .returning()
  const updated = result[0]

  if (!updated) {
    throw new TRPCError({ code: "NOT_FOUND", message: "List not found" })
  }

  await createAuditLog(ctx, {
    orgId,
    action: "UPDATE",
    entityId: updated.id,
    entityType: listEntity,
    entityTitle: updated.title ?? `List ${updated.id}`,
  })

  return updated
}

export async function getListById({ ctx, input }: List<Schema.TGetListById>) {
  const { id } = input

  const list = await ctx.db.query.lists.findFirst({
    where: {
      id,
    },
  })

  if (!list) {
    throw new TRPCError({ code: "NOT_FOUND", message: "List not found" })
  }

  return list
}

export async function getListsByBoardId({ ctx, input }: List<Schema.TGetListsByBoardId>) {
  const { boardId } = input

  const list = await ctx.db.query.lists.findMany({
    where: {
      boardId,
    },
  })

  return list ?? null
}
