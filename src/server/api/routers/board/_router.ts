import {
  createTRPCRouter,
  orgProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import * as handler from "./board.handler";
import * as schema from "./board.schema";

export const boardRouter = createTRPCRouter({
  create: orgProcedure.input(schema.ZCreateBoard).mutation(handler.createBoard),

  getBoards: protectedProcedure
    .input(schema.ZGetBoards)
    .query(handler.getBoards),

  getBoardById: protectedProcedure
    .input(schema.ZGetBoardById)
    .query(handler.getBoardById),

  deleteBoard: orgProcedure
    .input(schema.ZDeleteBoard)
    .mutation(handler.deleteBoard),

  updateBoard: orgProcedure
    .input(schema.ZUpdateBoard)
    .mutation(handler.updateBoard),
});
