import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards, cards, lists } from "~/server/db/schema";
import { and, desc, eq, exists } from "drizzle-orm";

import { validateOrgId } from "../../utils";
import type * as Schema from "./card.schema";

type Card<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

async function validateListAccess(
  ctx: ProtectedTRPCContext,
  listId: number,
  orgId: string,
): Promise<void> {
  const list = await ctx.db.query.lists.findFirst({
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
  if (!list) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "List not found" });
  }
}

export async function createCard({ input, ctx }: Card<Schema.TCreateCard>) {
  const { title, listId } = input;
  const orgId = await validateOrgId(ctx);
  await validateListAccess(ctx, listId, orgId);

  const lastCard = await ctx.db.query.cards.findFirst({
    where: eq(cards.listId, listId),
    orderBy: [desc(cards.createdAt)],
    columns: {
      order: true,
    },
  });

  const newOrder = lastCard ? lastCard.order + 1 : 1;

  const [card] = await ctx.db
    .insert(cards)
    .values({
      title,
      listId,
      order: newOrder,
    })
    .returning();

  return card ?? null;
}

export async function updateCardOrder({ input, ctx }: Card<Schema.TUpdateCardOrder>) {
  const { items } = input;
  const orgId = await validateOrgId(ctx);

  if (!items) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Items not found" });
  }

  const updates = items.map((card) =>
    ctx.db
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
              .where(and(eq(boards.orgId, orgId), eq(lists.id, card.listId))),
          ),
        ),
      ),
  );

  await ctx.db.transaction(async (tx) => {
    await Promise.all(updates.map((update) => tx.run(update)));
  });
}
