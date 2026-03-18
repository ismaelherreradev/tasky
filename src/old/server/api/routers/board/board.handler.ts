import { and, eq, inArray } from "drizzle-orm";
import type { ProtectedTRPCContext } from "~/server/api/trpc";
import { boards, cards, type EntityType, lists } from "~/server/db/schema";

import { createCrudHandlers } from "../../shared/crud-handler";
import {
  createAuditLog,
  requireOrgAccess,
  validateOrgAccess,
} from "../../shared/db-utils";
import type * as Schema from "./board.schema";

type Board<T> = {
  ctx: ProtectedTRPCContext;
  input: T;
};

const boardCrud = createCrudHandlers({
  table: boards,
  entityType: "BOARD" as EntityType,
  entityName: "Board",
  orgAccessCondition: (orgId: string) => eq(boards.orgId, orgId),
});

export async function createBoard({ ctx, input }: Board<Schema.TCreateBoard>) {
  requireOrgAccess(ctx);
  validateOrgAccess(ctx, input.orgId);

  return await boardCrud.create(ctx, {
    title: input.title,
    orgId: input.orgId,
  });
}

export async function getBoards({ ctx, input }: Board<Schema.TGetBoards>) {
  validateOrgAccess(ctx, input.orgId);

  const boardResults = await boardCrud.findMany(
    ctx,
    eq(boards.orgId, input.orgId),
  );
  return boardResults ?? null;
}

export async function getBoardById({
  ctx,
  input,
}: Board<Schema.TGetBoardById>) {
  validateOrgAccess(ctx, input.orgId);

  const board = await ctx.db
    .select()
    .from(boards)
    .where(and(eq(boards.id, input.boardId), eq(boards.orgId, input.orgId)))
    .get();

  return board ?? null;
}

export async function deleteBoard({ ctx, input }: Board<Schema.TDeleteBoard>) {
  const orgCtx = requireOrgAccess(ctx);
  const orgId = orgCtx.auth.orgId;

  const board = await ctx.db
    .select()
    .from(boards)
    .where(and(eq(boards.id, input.boardId), eq(boards.orgId, orgId)))
    .get();

  if (!board) {
    return null;
  }

  await ctx.db.transaction(async (tx) => {
    const boardLists = await tx
      .select({ id: lists.id })
      .from(lists)
      .where(eq(lists.boardId, input.boardId));

    if (boardLists.length > 0) {
      const listIds = boardLists.map((list) => list.id);
      await tx.delete(cards).where(inArray(cards.listId, listIds));
    }

    await tx.delete(lists).where(eq(lists.boardId, input.boardId));

    await tx.delete(boards).where(eq(boards.id, input.boardId));
  });

  await createAuditLog(ctx, {
    orgId,
    action: "DELETE",
    entityId: board.id,
    entityType: "BOARD",
    entityTitle: board.title,
  });

  return board;
}

export async function updateBoard({ ctx, input }: Board<Schema.TUpdateBoard>) {
  requireOrgAccess(ctx);

  const board = await boardCrud.update(ctx, input.boardId, {
    title: input.title,
  });

  return board ?? null;
}
