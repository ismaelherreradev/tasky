import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import * as handler from "./card.handler";
import * as schema from "./card.schema";

export const cardRouter = createTRPCRouter({
  createCard: protectedProcedure.input(schema.ZCreateCard).mutation(handler.createCard),
  updateCardOrder: protectedProcedure
    .input(schema.ZUpdateCardOrder)
    .mutation(handler.updateCardOrder),
  getCardById: protectedProcedure.input(schema.ZGetCardById).query(handler.getCardById),
  getCardsByListId: protectedProcedure
    .input(schema.ZGetCardsByListId)
    .query(handler.getCardsByListId),
  updateCard: protectedProcedure.input(schema.ZUpdateCard).mutation(handler.updateCard),
  copyCard: protectedProcedure.input(schema.ZCopyCard).mutation(handler.copyCard),
  deleteCard: protectedProcedure.input(schema.ZDeleteCard).mutation(handler.deleteCard),
});
