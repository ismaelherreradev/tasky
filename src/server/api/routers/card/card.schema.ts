import { z } from "zod";

// Common schema for ID fields
const idSchema = z.number().int().positive();

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
  order: z.number().int().nonnegative(),
  listId: idSchema,
});

export const ZUpdateCardOrder = z.object({
  items: z.array(cardItemSchema).nonempty({ message: "At least one item is required." }),
});

export type TUpdateCardOrder = z.infer<typeof ZUpdateCardOrder>;
