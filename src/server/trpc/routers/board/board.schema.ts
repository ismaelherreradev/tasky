import { z } from "zod"

import { idSchema, orgIdSchema, titleSchema } from "../../shared/schema-utils"

export const ZCreateBoard = z.object({
  title: titleSchema,
  orgId: orgIdSchema,
})

export type TCreateBoard = z.infer<typeof ZCreateBoard>

export const ZGetBoards = z.object({
  orgId: orgIdSchema,
})

export type TGetBoards = z.infer<typeof ZGetBoards>

export const ZGetBoardsWithStats = z.object({
  orgId: orgIdSchema,
})

export type TGetBoardsWithStats = z.infer<typeof ZGetBoardsWithStats>

export const ZGetBoardById = z.object({
  orgId: orgIdSchema,
  boardId: idSchema,
})

export type TGetBoardById = z.infer<typeof ZGetBoardById>

export const ZDeleteBoard = z.object({
  boardId: idSchema,
})

export type TDeleteBoard = z.infer<typeof ZDeleteBoard>

export const ZUpdateBoard = z.object({
  title: titleSchema,
  boardId: idSchema,
})

export type TUpdateBoard = z.infer<typeof ZUpdateBoard>
