import type { z } from "zod";

import {
  createEntitySchema,
  idSchema,
  orgIdSchema,
  titleSchema,
} from "../../shared/schema-utils";

export const ZCreateBoard = createEntitySchema({
  title: titleSchema,
  orgId: orgIdSchema,
});

export type TCreateBoard = z.infer<typeof ZCreateBoard>;

export const ZGetBoards = createEntitySchema({
  orgId: orgIdSchema,
});

export type TGetBoards = z.infer<typeof ZGetBoards>;

export const ZGetBoardById = createEntitySchema({
  orgId: orgIdSchema,
  boardId: idSchema,
});

export type TGetBoardById = z.infer<typeof ZGetBoardById>;

export const ZDeleteBoard = createEntitySchema({
  boardId: idSchema,
});

export type TDeleteBoard = z.infer<typeof ZDeleteBoard>;

export const ZUpdateBoard = createEntitySchema({
  title: titleSchema,
  boardId: idSchema,
});

export type TUpdateBoard = z.infer<typeof ZUpdateBoard>;
