import { z } from "zod";

// Common schema for ID fields
const idSchema = z.number().int().positive();
const orgIdSchema = z.string().min(1, { message: "orgId is required" });

export const ZCreateBoard = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(255, { message: "Title must be at most 255 characters long." }),
  orgId: orgIdSchema,
});

export type TCreateBoard = z.infer<typeof ZCreateBoard>;

export const ZGetBoards = z.object({
  orgId: orgIdSchema,
});

export type TGetBoards = z.infer<typeof ZGetBoards>;

export const ZGetBoardById = z.object({
  orgId: orgIdSchema,
  boardId: idSchema,
});

export type TGetBoardById = z.infer<typeof ZGetBoardById>;
