import { createTRPCRouter, createCallerFactory } from "./init"
import { boardRouter } from "./routers/board/_router"
import { cardRouter } from "./routers/card/_router"
import { listRouter } from "./routers/list/_router"
import { logsRouter } from "./routers/logs/_router"

export const appRouter = createTRPCRouter({
  board: boardRouter,
  list: listRouter,
  card: cardRouter,
  logs: logsRouter,
})

export const createCaller = createCallerFactory(appRouter)
export type AppRouter = typeof appRouter
