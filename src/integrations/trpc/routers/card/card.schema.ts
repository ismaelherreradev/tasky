import type { z } from "zod";

import {
  createBatchItemSchema,
  createEntitySchema,
  createUpdateSchema,
  descriptionSchema,
  idSchema,
  orderSchema,
  titleSchema,
} from "../../shared/schema-utils";

export const ZCreateCard = createEntitySchema({
  title: titleSchema,
  listId: idSchema,
});

export type TCreateCard = z.infer<typeof ZCreateCard>;

const cardItemSchema = {
  id: idSchema,
  title: titleSchema,
  order: orderSchema,
  listId: idSchema,
};

export const ZUpdateCardOrder = createBatchItemSchema(cardItemSchema);

export type TUpdateCardOrder = z.infer<typeof ZUpdateCardOrder>;

export const ZGetCardById = createEntitySchema({
  id: idSchema,
});

export type TGetCardById = z.infer<typeof ZGetCardById>;

export const ZUpdateCard = createUpdateSchema(
  {
    id: idSchema,
    title: titleSchema.optional(),
    order: orderSchema.optional(),
    listId: idSchema.optional(),
    description: descriptionSchema,
  },
  ["id"],
);

export type TUpdateCard = z.infer<typeof ZUpdateCard>;

export const ZCopyCard = createEntitySchema({
  id: idSchema,
  boardId: idSchema,
});

export type TCopyCard = z.infer<typeof ZCopyCard>;

export const ZDeleteCard = createEntitySchema({
  id: idSchema,
  boardId: idSchema,
});

export type TDeleteCard = z.infer<typeof ZDeleteCard>;

export const ZGetCardsByListId = createEntitySchema({
  listId: idSchema,
});

export type TGetCardsByListId = z.infer<typeof ZGetCardsByListId>;
