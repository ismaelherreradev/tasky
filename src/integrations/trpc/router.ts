import { createTRPCRouter, createCallerFactory } from "./init"

// import { cardRouter } from "~/server/api/routers/card/_router";
// import { listRouter } from "~/server/api/routers/list/_router";
// import { logsRouter } from "~/server/api/routers/logs/_router";
//
export const appRouter = createTRPCRouter({
  board: boardRouter,
  // list: listRouter,
  // card: cardRouter,
  // logs: logsRouter,
})

import { boardRouter } from "./routers/board/_router"

export const createCaller = createCallerFactory(appRouter)
export type AppRouter = typeof appRouter
