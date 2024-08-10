import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards, type Action, type EntityType } from "~/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

import { createAuditLog, validateOrgId } from "../../utils";
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

  if (board) {
    await createAuditLog({
      orgId: input.orgId,
      action: "CREATE" as Action,
      entityId: board.id,
      entityType: "BOARD" as EntityType,
      entityTitle: board.title,
    });
  }

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

export async function deleteBoard({ ctx, input }: Board<Schema.TDeleteBoard>) {
  const { boardId } = input;
  const orgId = await validateOrgId(ctx);

  const [board] = await ctx.db
    .delete(boards)
    .where(and(eq(boards.id, boardId), eq(boards.orgId, orgId)))
    .returning();

  if (board) {
    await createAuditLog({
      orgId,
      action: "DELETE" as Action,
      entityId: board.id,
      entityType: "BOARD" as EntityType,
      entityTitle: board.title,
    });
  }

  return board ?? null;
}

export async function updateBoard({ ctx, input }: Board<Schema.TUpdateBoard>) {
  const { title, boardId } = input;
  const orgId = await validateOrgId(ctx);

  const [board] = await ctx.db
    .update(boards)
    .set({ title })
    .where(and(eq(boards.id, boardId), eq(boards.orgId, orgId)))
    .returning();

  if (board) {
    await createAuditLog({
      orgId,
      action: "UPDATE" as Action,
      entityId: board.id,
      entityType: "BOARD" as EntityType,
      entityTitle: board.title,
    });
  }

  return board ?? null;
}
