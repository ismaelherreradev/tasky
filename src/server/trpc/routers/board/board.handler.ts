import { TRPCError } from "@trpc/server"
import { and, desc, eq, inArray } from "drizzle-orm"

import { boards, cards, lists, type EntityType } from "#/server/db/schema"
import type { BoardSelect } from "#/server/db/schema"
import type { ProtectedTRPCContext } from "#/server/trpc/init"

import { createAuditLog, requireOrgAccess, validateOrgAccess } from "../../shared/db-utils"
import type * as Schema from "./board.schema"
type Board<T> = {
  ctx: ProtectedTRPCContext
  input: T
}

const boardEntity: EntityType = "BOARD"

export async function createBoard({ ctx, input }: Board<Schema.TCreateBoard>) {
  requireOrgAccess(ctx)
  validateOrgAccess(ctx, input.orgId)

  const result = await ctx.db
    .insert(boards)
    .values({
      title: input.title,
      orgId: input.orgId,
    })
    .returning()

  const board = result[0]
  if (!board) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create board" })
  }

  await createAuditLog(ctx, {
    orgId: input.orgId,
    action: "CREATE",
    entityId: board.id,
    entityType: boardEntity,
    entityTitle: board.title ?? `Board ${board.id}`,
  })

  return board
}

export async function getBoards({ ctx, input }: Board<Schema.TGetBoards>) {
  validateOrgAccess(ctx, input.orgId)

  const boardResults = await ctx.db
    .select()
    .from(boards)
    .where(eq(boards.orgId, input.orgId))
    .orderBy(desc(boards.createdAt))
  return boardResults as BoardSelect[]
}

export async function getBoardsWithStats({ ctx, input }: Board<Schema.TGetBoardsWithStats>) {
  validateOrgAccess(ctx, input.orgId)

  const boardResults = await ctx.db
    .select()
    .from(boards)
    .where(eq(boards.orgId, input.orgId))
    .orderBy(desc(boards.createdAt))

  const boardsWithStats = await Promise.all(
    boardResults.map(async (board) => {
      const boardLists = await ctx.db
        .select({ id: lists.id })
        .from(lists)
        .where(eq(lists.boardId, board.id))

      const listIds = boardLists.map((l) => l.id)

      let cardCount = 0
      if (listIds.length > 0) {
        const cardsResult = await ctx.db
          .select({ id: cards.id })
          .from(cards)
          .where(inArray(cards.listId, listIds))
        cardCount = cardsResult.length
      }

      return {
        ...board,
        listCount: boardLists.length,
        cardCount,
      }
    }),
  )

  return boardsWithStats as (BoardSelect & { listCount: number; cardCount: number })[]
}

export async function getBoardById({ ctx, input }: Board<Schema.TGetBoardById>) {
  validateOrgAccess(ctx, input.orgId)

  const board = await ctx.db
    .select()
    .from(boards)
    .where(and(eq(boards.id, input.boardId), eq(boards.orgId, input.orgId)))
    .get()

  return board ?? null
}

export async function deleteBoard({ ctx, input }: Board<Schema.TDeleteBoard>) {
  const orgCtx = requireOrgAccess(ctx)
  const orgId = orgCtx.auth.orgId

  const board = await ctx.db
    .select()
    .from(boards)
    .where(and(eq(boards.id, input.boardId), eq(boards.orgId, orgId)))
    .get()

  if (!board) {
    return null
  }

  const boardLists = await ctx.db
    .select({ id: lists.id })
    .from(lists)
    .where(eq(lists.boardId, input.boardId))

  if (boardLists.length > 0) {
    const listIds = boardLists.map((list) => list.id)
    await ctx.db.delete(cards).where(inArray(cards.listId, listIds))
  }

  await ctx.db.delete(lists).where(eq(lists.boardId, input.boardId))
  await ctx.db.delete(boards).where(eq(boards.id, input.boardId))

  await createAuditLog(ctx, {
    orgId,
    action: "DELETE",
    entityId: board.id,
    entityType: "BOARD",
    entityTitle: board.title,
  })

  return board
}

export async function updateBoard({ ctx, input }: Board<Schema.TUpdateBoard>) {
  const orgCtx = requireOrgAccess(ctx)
  const orgId = orgCtx.auth.orgId

  const result = await ctx.db
    .update(boards)
    .set({ title: input.title })
    .where(and(eq(boards.id, input.boardId), eq(boards.orgId, orgId)))
    .returning()

  const board = result[0]
  if (!board) {
    return null
  }

  await createAuditLog(ctx, {
    orgId,
    action: "UPDATE",
    entityId: board.id,
    entityType: boardEntity,
    entityTitle: board.title ?? `Board ${board.id}`,
  })

  return board
}
