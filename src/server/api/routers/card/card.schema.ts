import { z } from "zod";

// Common schema for ID fields
const idSchema = z.number().int().positive({ message: "ID must be a positive integer." });

export const ZCreateCard = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(255, { message: "Title must be at most 255 characters long." }),
  listId: idSchema,
});

export type TCreateCard = z.infer<typeof ZCreateCard>;

// Schema for card item in update operation
const cardItemSchema = z.object({
  id: idSchema,
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  order: z.number().int().nonnegative({ message: "Order must be a non-negative integer." }),
  listId: idSchema,
});

export const ZUpdateCardOrder = z.object({
  items: z.array(cardItemSchema).nonempty({ message: "At least one item is required." }),
});

export type TUpdateCardOrder = z.infer<typeof ZUpdateCardOrder>;

export const ZGetCardById = z.object({
  id: idSchema,
});

export type TGetCardById = z.infer<typeof ZGetCardById>;

export const ZUpdateCard = z.object({
  id: idSchema,
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(255, { message: "Title must be at most 255 characters long." })
    .optional(),
  order: z
    .number()
    .int()
    .nonnegative({ message: "Order must be a non-negative integer." })
    .optional(),
  listId: z.number().int().positive({ message: "List ID must be a positive integer." }).optional(),
  description: z.string().optional(),
});

export type TUpdateCard = z.infer<typeof ZUpdateCard>;

export const ZCopyCard = z.object({
  id: idSchema,
  boardId: idSchema,
});

export type TCopyCard = z.infer<typeof ZCopyCard>;

export const ZDeleteCard = z.object({
  id: idSchema,
  boardId: idSchema,
});

export type TDeleteCard = z.infer<typeof ZDeleteCard>;

export const ZGetCardsByListId = z.object({
  listId: z.number().int().positive(),
});

export type TGetCardsByListId = z.infer<typeof ZGetCardsByListId>;
