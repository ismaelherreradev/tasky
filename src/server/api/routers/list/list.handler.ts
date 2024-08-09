import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards, cards, lists } from "~/server/db/schema";
import { asc, desc, eq } from "drizzle-orm";

import type * as Schema from "./list.schema";

type List<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

// export async function updateList({
//     ctx, input,
// }: BoardProp<SchemaTypes.TUpdateList>) {
//     const { items, orgId } = input;

//     let listsResult;

//     try {
//         const transaction = items.map((listItem) => ctx.db
//             .update(lists)
//             .set({
//                 order: listItem.order,
//             })
//             .where(
//                 eq(lists.id, listItem.id) &&
//                 eq(lists.boardId, listItem.boardId) && // Assuming listItem has boardId
//                 eq(boards.orgId, orgId)
//             )
//         );

//         listsResult = await ctx.db.transaction(transaction);
//     } catch (error) {
//         return {
//             error: "Failed to reorder.",
//         };
//     }

//     return listsResult;
// }

// if (!secondaryEmail) {
//   throw new TRPCError({ code: "BAD_REQUEST", message: "Email not found" });
// }

export async function createList({ input, ctx }: List<Schema.TCreateList>) {
  const { title, boardId } = input;
  const { orgId } = ctx.auth;

  if (!orgId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "OrgId not found" });
  }

  const board = await ctx.db.query.boards.findFirst({
    where: eq(boards.id, boardId) && eq(boards.orgId, orgId),
  });

  if (!board) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Board not found" });
  }

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

  return list ?? null;
}

export async function getlistsWithCards({ ctx, input }: List<Schema.TZGetlistsWithCards>) {
  const { boardId } = input;
  const { orgId } = ctx.auth;

  if (!orgId) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "OrgId not found" });
  }

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
