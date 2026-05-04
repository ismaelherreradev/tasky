import { createTRPCRouter, orgProcedure, protectedProcedure } from "../../init"
import * as handler from "./card.handler"
import * as schema from "./card.schema"

export const cardRouter = createTRPCRouter({
  createCard: orgProcedure.input(schema.ZCreateCard).mutation(handler.createCard),

  updateCardOrder: orgProcedure
    .input(schema.ZUpdateCardOrder)
    .mutation(handler.updateCardOrder),

  getCardById: orgProcedure.input(schema.ZGetCardById).query(handler.getCardById),

  getCardsByListId: protectedProcedure
    .input(schema.ZGetCardsByListId)
    .query(handler.getCardsByListId),

  updateCard: orgProcedure.input(schema.ZUpdateCard).mutation(handler.updateCard),

  copyCard: orgProcedure.input(schema.ZCopyCard).mutation(handler.copyCard),

  deleteCard: orgProcedure.input(schema.ZDeleteCard).mutation(handler.deleteCard),
})
