import { z } from "zod";

export const ZCreateBoard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, { message: "Title must be at least 3 characters long." }),
  orgId: z.string({
    required_error: "Missing orgId.",
    invalid_type_error: "Missing orgId.",
  }),
});

export type TCreateBoard = z.infer<typeof ZCreateBoard>;

export const ZGetBoards = z.object({
  orgId: z.string({
    required_error: "Missing orgId.",
    invalid_type_error: "Missing orgId.",
  }),
});

export type TGetBoards = z.infer<typeof ZGetBoards>;

export const ZGetBoardById = z.object({
  orgId: z.string({
    required_error: "Missing orgId.",
    invalid_type_error: "Missing orgId.",
  }),
  boardId: z.number({
    required_error: "Missing boardId.",
    invalid_type_error: "Missing boardId.",
  }),
});

export type TGetBoardById = z.infer<typeof ZGetBoardById>;
