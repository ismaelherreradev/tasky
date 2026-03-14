import { TRPCError } from "@trpc/server";
import { and, desc, eq, exists, type InferSelectModel } from "drizzle-orm";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import {
  boards,
  type CardSelect,
  cards,
  type EntityType,
  lists,
} from "~/server/db/schema";

import { createCrudHandlers } from "../../shared/crud-handler";
import { createAuditLog, validateOrgId } from "../../shared/db-utils";
import type * as Schema from "./card.schema";

export type ListSelect = Omit<InferSelectModel<typeof lists>, "order">;
export type CardWithList = CardSelect & { list: ListSelect };

type Card<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

const cardCrud = createCrudHandlers({
  table: cards,
  entityType: "CARD" as EntityType,
  entityName: "Card",
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
        .from(lists)
        .innerJoin(boards, eq(lists.boardId, boards.id))
        .where(and(eq(boards.orgId, orgId), eq(lists.id, cards.listId))),
    );
  },
});

async function validateListAccess(
  ctx: ProtectedTRPCContext,
  listId: number,
  orgId: string,
): Promise<void> {
  const listExists = await ctx.db.query.lists.findFirst({
    where: (lists, { eq, and, exists }) =>
      and(
        eq(lists.id, listId),
        exists(
          ctx.db
            .select()
            .from(boards)
            .where(and(eq(boards.id, lists.boardId), eq(boards.orgId, orgId))),
        ),
      ),
  });
  if (!listExists) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "List not found" });
  }
}

async function getLastCardOrder(
  ctx: ProtectedTRPCContext,
  listId: number,
): Promise<number> {
  const lastCard = await ctx.db.query.cards.findFirst({
    where: eq(cards.listId, listId),
    orderBy: [desc(cards.createdAt)],
    columns: { order: true },
  });
  return lastCard ? lastCard.order + 1 : 1;
}

export async function createCard({ input, ctx }: Card<Schema.TCreateCard>) {
  const { title, listId } = input;
  const orgId = await validateOrgId(ctx);

  await validateListAccess(ctx, listId, orgId);

  return await cardCrud.create(
    ctx,
    { title, listId },
    {
      getNextOrder: async (ctx, data) => {
        const cardData = data as { listId: number };
        return getLastCardOrder(ctx, cardData.listId);
      },
    },
  );
}

export async function updateCardOrder({
  input,
  ctx,
}: Card<Schema.TUpdateCardOrder>) {
  const { items } = input;

  if (!items) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Items not found" });
  }

  await cardCrud.batchUpdate(
    ctx,
    items.map((card) => ({
      id: card.id,
      order: card.order,
      listId: card.listId,
    })),
  );
}

export async function getCardById({ input, ctx }: Card<Schema.TGetCardById>) {
  const { id } = input;
  const orgId = await validateOrgId(ctx);

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
    .get();

  if (!card) {
    return null;
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
  };

  return cardWithList;
}

export async function updateCard({ input, ctx }: Card<Schema.TUpdateCard>) {
  const { id, ...updateData } = input;
  if (typeof id !== "number") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid card ID" });
  }
  return await cardCrud.update(ctx, id, updateData);
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

export async function copyCard({ input, ctx }: Card<Schema.TCopyCard>) {
  const { id, boardId } = input;
  const orgId = await validateOrgId(ctx);

  const card = await ctx.db.query.cards.findFirst({
    where: (cards, { eq, and, exists }) =>
      and(
        eq(cards.id, id),
        exists(
          ctx.db
            .select()
            .from(lists)
            .innerJoin(boards, eq(lists.boardId, boards.id))
            .where(and(eq(boards.id, boardId), eq(boards.orgId, orgId))),
        ),
      ),
  });

  if (!card) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
  }

  const newOrder = await getLastListOrder(ctx, boardId);

  const result = await cardCrud.create(ctx, {
    title: card.title,
    description: card.description,
    listId: card.listId,
    order: newOrder,
  });

  return result;
}

export async function deleteCard({ input, ctx }: Card<Schema.TDeleteCard>) {
  const { id, boardId } = input;
  const orgId = await validateOrgId(ctx);

  const card = await ctx.db.query.cards.findFirst({
    where: (cards, { eq, and, exists }) =>
      and(
        eq(cards.id, id),
        exists(
          ctx.db
            .select()
            .from(lists)
            .innerJoin(boards, eq(lists.boardId, boards.id))
            .where(and(eq(boards.id, boardId), eq(boards.orgId, orgId))),
        ),
      ),
  });

  if (!card) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Card not found" });
  }

  await ctx.db.delete(cards).where(eq(cards.id, id));

  await createAuditLog(ctx, {
    orgId,
    action: "DELETE",
    entityId: card.id,
    entityType: "CARD",
    entityTitle: card.title,
  });

  return { id, title: card.title };
}

export async function getCardsByListId({
  input,
  ctx,
}: Card<Schema.TGetCardsByListId>) {
  const { listId } = input;

  const cardList = await ctx.db.query.cards.findMany({
    where: eq(cards.listId, listId),
  });

  return cardList;
}
