import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import * as handler from "./board.handler";
import * as schema from "./board.schema";

export const boardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(schema.ZCreateBoard)
    .mutation(({ ctx, input }) => handler.createBoard({ ctx, input })),
  getBoards: protectedProcedure.input(schema.ZGetBoards).query(handler.getBoards),
  getBoardById: protectedProcedure.input(schema.ZGetBoardById).query(handler.getBoardById),
});
