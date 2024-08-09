import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import * as handler from "./list.handler";
import * as schema from "./list.schema";

export const listRouter = createTRPCRouter({
  createList: protectedProcedure
    .input(schema.ZCreateList)
    .mutation(({ ctx, input }) => handler.createList({ ctx, input })),
  getlistsWithCards: protectedProcedure
    .input(schema.ZGetlistsWithCards)
    .query(handler.getlistsWithCards),
  updateListOrder: protectedProcedure
    .input(schema.ZUpdateListOrder)
    .mutation(({ ctx, input }) => handler.updateListOrder({ ctx, input })),
});
