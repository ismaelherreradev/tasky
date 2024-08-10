import { z } from "zod";

// Common schema for list ID and board ID
const listIdSchema = z.number().int().positive();
const boardIdSchema = z.number().int().positive();

// Schema for list item in update operation
const listItemSchema = z.object({
  id: listIdSchema,
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  order: z.number().int().nonnegative({ message: "Order must be a non-negative integer." }),
});

export const ZUpdateListOrder = z.object({
  items: z.array(listItemSchema).nonempty({ message: "At least one item is required." }),
});

export type TUpdateListOrder = z.infer<typeof ZUpdateListOrder>;

export const ZCreateList = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(255, { message: "Title must be at most 255 characters long." }),
  boardId: boardIdSchema,
});

export type TCreateList = z.infer<typeof ZCreateList>;

export const ZGetlistsWithCards = z.object({
  boardId: boardIdSchema,
});

export type TGetlistsWithCards = z.infer<typeof ZGetlistsWithCards>;

export const ZCopyList = z.object({
  listId: listIdSchema,
  boardId: boardIdSchema,
});

export type TCopyList = z.infer<typeof ZCopyList>;

export const ZDeleteList = z.object({
  listId: listIdSchema,
  boardId: boardIdSchema,
});

export type TDeleteList = z.infer<typeof ZDeleteList>;

export const ZUpdateList = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(255, { message: "Title must be at most 255 characters long." }),
  listId: listIdSchema,
  boardId: boardIdSchema,
  order: z
    .number()
    .int()
    .nonnegative({ message: "Order must be a non-negative integer." })
    .optional(),
});

export type TUpdateList = z.infer<typeof ZUpdateList>;

export const ZGetListById = z.object({
  id: z.number().int().positive(),
});

export type TGetListById = z.infer<typeof ZGetListById>;

export const ZGetListsByBoardId = z.object({
  boardId: z.number().int().positive(),
});

export type TGetListsByBoardId = z.infer<typeof ZGetListsByBoardId>;
