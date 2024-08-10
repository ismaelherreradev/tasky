import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import * as handler from "./card.handler";
import * as schema from "./card.schema";

export const cardRouter = createTRPCRouter({
  createCard: protectedProcedure.input(schema.ZCreateCard).mutation(handler.createCard),
  updateCardOrder: protectedProcedure
    .input(schema.ZUpdateCardOrder)
    .mutation(handler.updateCardOrder),
});
