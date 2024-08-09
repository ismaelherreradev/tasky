import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards } from "~/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

import type * as Schema from "./board.schema";

type Board<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

export async function createBoard({ ctx, input }: Board<Schema.TCreateBoard>) {
  const [board] = await ctx.db
    .insert(boards)
    .values({
      title: input.title,
      orgId: input.orgId,
    })
    .returning();

  return board;
}

export async function getBoards({ ctx, input }: Board<Schema.TGetBoards>) {
  const boardResults = await ctx.db.query.boards.findMany({
    where: eq(boards.orgId, input.orgId),
    orderBy: [desc(boards.createdAt)],
  });

  return boardResults ?? null;
}

export async function getBoardById({ ctx, input }: Board<Schema.TGetBoardById>) {
  const board = await ctx.db
    .select()
    .from(boards)
    .where(and(eq(boards.id, input.boardId), eq(boards.orgId, input.orgId)))
    .get();
  return board ?? null;
}
