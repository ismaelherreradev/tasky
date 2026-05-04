import { createTRPCRouter, orgProcedure, protectedProcedure } from "../../init"
import * as handler from "./list.handler"
import * as schema from "./list.schema"

export const listRouter = createTRPCRouter({
  createList: orgProcedure.input(schema.ZCreateList).mutation(handler.createList),

  getlistsWithCards: orgProcedure
    .input(schema.ZGetlistsWithCards)
    .query(handler.getlistsWithCards),

  updateListOrder: orgProcedure
    .input(schema.ZUpdateListOrder)
    .mutation(handler.updateListOrder),

  copyList: orgProcedure.input(schema.ZCopyList).mutation(handler.copyList),

  deleteList: orgProcedure.input(schema.ZDeleteList).mutation(handler.deleteList),

  updateList: orgProcedure.input(schema.ZUpdateList).mutation(handler.updateList),

  getListById: protectedProcedure.input(schema.ZGetListById).query(handler.getListById),

  getListsByBoardId: protectedProcedure
    .input(schema.ZGetListsByBoardId)
    .query(handler.getListsByBoardId),
})
