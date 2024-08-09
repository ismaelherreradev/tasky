import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards, cards } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

import type * as Schema from "./card.schema";

type List<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

export async function createCard({ input, ctx }: List<Schema.TCreateCard>) {
  const { title, listId } = input;
  const { orgId } = ctx.auth;

  if (!orgId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "OrgId not found" });
  }

  const list = await ctx.db.query.lists.findMany({
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
