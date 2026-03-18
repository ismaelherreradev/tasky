import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import * as handler from "./list.handler";
import * as schema from "./list.schema";

export const listRouter = createTRPCRouter({
  createList: protectedProcedure
    .input(schema.ZCreateList)
    .mutation(handler.createList),

  getlistsWithCards: protectedProcedure
    .input(schema.ZGetlistsWithCards)
    .query(handler.getlistsWithCards),

  updateListOrder: protectedProcedure
    .input(schema.ZUpdateListOrder)
    .mutation(handler.updateListOrder),

  copyList: protectedProcedure
    .input(schema.ZCopyList)
    .mutation(handler.copyList),

  deleteList: protectedProcedure
    .input(schema.ZDeleteList)
    .mutation(handler.deleteList),

  updateList: protectedProcedure
    .input(schema.ZUpdateList)
    .mutation(handler.updateList),

  getListById: protectedProcedure
    .input(schema.ZGetListById)
    .query(handler.getListById),

  getListsByBoardId: protectedProcedure
    .input(schema.ZGetListsByBoardId)
    .query(handler.getListsByBoardId),
});
