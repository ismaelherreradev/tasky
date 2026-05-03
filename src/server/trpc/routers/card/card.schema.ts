import { z } from "zod"

import { descriptionSchema, idSchema, orderSchema, titleSchema } from "../../shared/schema-utils"

export const ZCreateCard = z.object({
  title: titleSchema,
  listId: idSchema,
})

export type TCreateCard = z.infer<typeof ZCreateCard>

const cardItemSchema = {
  id: idSchema,
  title: titleSchema,
  order: orderSchema,
  listId: idSchema,
}

export const ZUpdateCardOrder = z.object({
  items: z.array(z.object(cardItemSchema)).nonempty({ message: "At least one item is required." }),
})

export type TUpdateCardOrder = z.infer<typeof ZUpdateCardOrder>

export const ZGetCardById = z.object({
  id: idSchema,
})

export type TGetCardById = z.infer<typeof ZGetCardById>

export const ZUpdateCard = z
  .object({
    id: idSchema,
    title: titleSchema.optional(),
    order: orderSchema.optional(),
    listId: idSchema.optional(),
    description: descriptionSchema,
  })
  .partial()
  .required({ id: true })

export type TUpdateCard = z.infer<typeof ZUpdateCard>

export const ZCopyCard = z.object({
  id: idSchema,
  boardId: idSchema,
})

export type TCopyCard = z.infer<typeof ZCopyCard>

export const ZDeleteCard = z.object({
  id: idSchema,
  boardId: idSchema,
})

export type TDeleteCard = z.infer<typeof ZDeleteCard>

export const ZGetCardsByListId = z.object({
  listId: idSchema,
})

export type TGetCardsByListId = z.infer<typeof ZGetCardsByListId>
