import { z } from "zod"

import { idSchema, orderSchema, titleSchema } from "../../shared/schema-utils"

const colorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, { message: "Invalid color format" })
  .optional()

const listItemSchema = {
  id: idSchema,
  title: titleSchema,
  order: orderSchema,
}

export const ZUpdateListOrder = z.object({
  items: z.array(z.object(listItemSchema)).nonempty({ message: "At least one item is required." }),
})

export type TUpdateListOrder = z.infer<typeof ZUpdateListOrder>

export const ZCreateList = z.object({
  title: titleSchema,
  boardId: idSchema,
  color: colorSchema,
})

export type TCreateList = z.infer<typeof ZCreateList>

export const ZGetlistsWithCards = z.object({
  boardId: idSchema,
})

export type TGetlistsWithCards = z.infer<typeof ZGetlistsWithCards>

export const ZCopyList = z.object({
  listId: idSchema,
  boardId: idSchema,
})

export type TCopyList = z.infer<typeof ZCopyList>

export const ZDeleteList = z.object({
  listId: idSchema,
  boardId: idSchema,
})

export type TDeleteList = z.infer<typeof ZDeleteList>

export const ZUpdateList = z
  .object({
    title: titleSchema,
    color: colorSchema,
    listId: idSchema,
    boardId: idSchema,
    order: orderSchema.optional(),
  })
  .partial()
  .required({
    title: true,
    listId: true,
    boardId: true,
  })

export type TUpdateList = z.infer<typeof ZUpdateList>

export const ZGetListById = z.object({
  id: idSchema,
})

export type TGetListById = z.infer<typeof ZGetListById>

export const ZGetListsByBoardId = z.object({
  boardId: idSchema,
})

export type TGetListsByBoardId = z.infer<typeof ZGetListsByBoardId>
