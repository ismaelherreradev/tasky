import { TRPCError } from "@trpc/server"
import { and, eq, exists, type InferSelectModel } from "drizzle-orm"

import { boards, type CardSelect, cards, type EntityType, lists } from "#/server/db/schema"

import type { ProtectedTRPCContext } from "../../init"
import { createAuditLog, validateOrgId } from "../../shared/db-utils"
import type * as Schema from "./card.schema"

export type ListSelect = Omit<InferSelectModel<typeof lists>, "order">
export type CardWithList = CardSelect & { list: ListSelect }

type Card<T> = {
  ctx: ProtectedTRPCContext
  input: T
}

const cardEntity: EntityType = "CARD"

async function validateListAccess(
  ctx: ProtectedTRPCContext,
  listId: number,
  orgId: string,
): Promise<void> {
  const listExists = await ctx.db.query.lists.findFirst({
    where: {
      id: listId,
      board: {
        orgId,
      },
    },
    columns: { id: true },
  })
  if (!listExists) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "List not found" })
  }
}

async function getLastCardOrder(ctx: ProtectedTRPCContext, listId: number): Promise<number> {
  const lastCard = await ctx.db.query.cards.findFirst({
    where: {
      listId,
    },
    orderBy: { createdAt: "desc" },
    columns: { order: true },
  })
  return lastCard ? lastCard.order + 1 : 1
}

export async function createCard({ input, ctx }: Card<Schema.TCreateCard>) {
  const { title, listId } = input
  const orgId = await validateOrgId(ctx)

  await validateListAccess(ctx, listId, orgId)

  const order = await getLastCardOrder(ctx, listId)

  const result = await ctx.db.insert(cards).values({ title, listId, order }).returning()
  const card = result[0]

  if (!card) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create card" })
  }

  await createAuditLog(ctx, {
    orgId,
    action: "CREATE",
    entityId: card.id,
    entityType: cardEntity,
    entityTitle: card.title ?? `Card ${card.id}`,
  })

  return card
}

export async function updateCardOrder({ input, ctx }: Card<Schema.TUpdateCardOrder>) {
  const { items } = input

  if (!items) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Items not found" })
  }

  const orgId = await validateOrgId(ctx)

  await Promise.all(
    items.map(async (card) => {
      await ctx.db
        .update(cards)
        .set({ order: card.order, listId: card.listId })
        .where(
          and(
            eq(cards.id, card.id),
            exists(
              ctx.db
                .select()
                .from(lists)
                .innerJoin(boards, eq(lists.boardId, boards.id))
                .where(and(eq(boards.orgId, orgId), eq(lists.id, cards.listId))),
            ),
          ),
        )
    }),
  )
}

export async function getCardById({ input, ctx }: Card<Schema.TGetCardById>) {
  const { id } = input
  const orgId = await validateOrgId(ctx)

  const card = await ctx.db
    .select({
      id: cards.id,
      title: cards.title,
      order: cards.order,
      description: cards.description,
      listId: cards.listId,
      createdAt: cards.createdAt,
      updatedAt: cards.updatedAt,
      listTitle: lists.title,
      listCreatedAt: lists.createdAt,
      listUpdatedAt: lists.updatedAt,
      boardId: boards.id,
    })
    .from(cards)
    .innerJoin(lists, eq(cards.listId, lists.id))
    .innerJoin(boards, eq(lists.boardId, boards.id))
    .where(and(eq(cards.id, id), eq(boards.orgId, orgId)))
    .get()

  if (!card) {
    return null
  }

  const cardWithList: CardWithList = {
    id: card.id,
    title: card.title,
    order: card.order,
    description: card.description,
    listId: card.listId,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    list: {
      id: card.listId,
      title: card.listTitle,
      boardId: card.boardId,
      createdAt: card.listCreatedAt,
      updatedAt: card.listUpdatedAt,
    },
  }

  return cardWithList
}

export async function updateCard({ input, ctx }: Card<Schema.TUpdateCard>) {
  const { id, ...updateData } = input
  if (typeof id !== "number") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid card ID" })
  }
  const orgId = await validateOrgId(ctx)

  const existing = await ctx.db
    .select({ id: cards.id, title: cards.title })
    .from(cards)
    .innerJoin(lists, eq(cards.listId, lists.id))
    .innerJoin(boards, eq(lists.boardId, boards.id))
    .where(and(eq(cards.id, id), eq(boards.orgId, orgId)))
    .get()

  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" })
  }

  const result = await ctx.db.update(cards).set(updateData).where(eq(cards.id, id)).returning()
  const updated = result[0]

  if (!updated) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" })
  }

  await createAuditLog(ctx, {
    orgId,
    action: "UPDATE",
    entityId: updated.id,
    entityType: cardEntity,
    entityTitle: updated.title ?? `Card ${updated.id}`,
  })

  return updated
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

export async function copyCard({ input, ctx }: Card<Schema.TCopyCard>) {
  const { id, boardId } = input
  const orgId = await validateOrgId(ctx)

  const card = await ctx.db
    .select({
      title: cards.title,
      description: cards.description,
      listId: cards.listId,
    })
    .from(cards)
    .innerJoin(lists, eq(cards.listId, lists.id))
    .innerJoin(boards, eq(lists.boardId, boards.id))
    .where(and(eq(cards.id, id), eq(boards.id, boardId), eq(boards.orgId, orgId)))
    .get()

  if (!card) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" })
  }

  const newOrder = await getLastListOrder(ctx, boardId)

  const result = await ctx.db
    .insert(cards)
    .values({
      title: card.title,
      description: card.description,
      listId: card.listId,
      order: newOrder,
    })
    .returning()

  const created = result[0]

  if (!created) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to create card" })
  }

  await createAuditLog(ctx, {
    orgId,
    action: "CREATE",
    entityId: created.id,
    entityType: cardEntity,
    entityTitle: created.title ?? `Card ${created.id}`,
  })

  return created
}

export async function deleteCard({ input, ctx }: Card<Schema.TDeleteCard>) {
  const { id, boardId } = input
  const orgId = await validateOrgId(ctx)

  const card = await ctx.db
    .select({ id: cards.id, title: cards.title })
    .from(cards)
    .innerJoin(lists, eq(cards.listId, lists.id))
    .innerJoin(boards, eq(lists.boardId, boards.id))
    .where(and(eq(cards.id, id), eq(boards.id, boardId), eq(boards.orgId, orgId)))
    .get()

  if (!card) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" })
  }

  await ctx.db.delete(cards).where(eq(cards.id, id))

  await createAuditLog(ctx, {
    orgId,
    action: "DELETE",
    entityId: card.id,
    entityType: cardEntity,
    entityTitle: card.title ?? `Card ${card.id}`,
  })

  return { id, title: card.title }
}

export async function getCardsByListId({ input, ctx }: Card<Schema.TGetCardsByListId>) {
  const { listId } = input

  const cardList = await ctx.db.query.cards.findMany({
    where: {
      listId,
    },
  })

  return cardList
}
