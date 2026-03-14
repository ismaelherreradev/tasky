import type { z } from "zod";

import {
  createBatchItemSchema,
  createEntitySchema,
  createUpdateSchema,
  idSchema,
  orderSchema,
  titleSchema,
} from "../../shared/schema-utils";

const listItemSchema = {
  id: idSchema,
  title: titleSchema,
  order: orderSchema,
};

export const ZUpdateListOrder = createBatchItemSchema(listItemSchema);

export type TUpdateListOrder = z.infer<typeof ZUpdateListOrder>;

export const ZCreateList = createEntitySchema({
  title: titleSchema,
  boardId: idSchema,
});

export type TCreateList = z.infer<typeof ZCreateList>;

export const ZGetlistsWithCards = createEntitySchema({
  boardId: idSchema,
});

export type TGetlistsWithCards = z.infer<typeof ZGetlistsWithCards>;

export const ZCopyList = createEntitySchema({
  listId: idSchema,
  boardId: idSchema,
});

export type TCopyList = z.infer<typeof ZCopyList>;

export const ZDeleteList = createEntitySchema({
  listId: idSchema,
  boardId: idSchema,
});

export type TDeleteList = z.infer<typeof ZDeleteList>;

export const ZUpdateList = createUpdateSchema(
  {
    title: titleSchema,
    listId: idSchema,
    boardId: idSchema,
    order: orderSchema.optional(),
  },
  ["title", "listId", "boardId"],
);

export type TUpdateList = z.infer<typeof ZUpdateList>;

export const ZGetListById = createEntitySchema({
  id: idSchema,
});

export type TGetListById = z.infer<typeof ZGetListById>;

export const ZGetListsByBoardId = createEntitySchema({
  boardId: idSchema,
});

export type TGetListsByBoardId = z.infer<typeof ZGetListsByBoardId>;
