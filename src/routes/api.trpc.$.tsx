import { createFileRoute } from "@tanstack/react-router"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { auth } from "@clerk/tanstack-react-start/server"
import { appRouter } from "~/server/api/root"
import { createTRPCContext } from "~/server/api/trpc"

async function handler({ request }: { request: Request }) {
  const authObj = await auth()
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: () =>
      createTRPCContext({
        headers: request.headers,
        auth: authObj,
      }),
  })
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
})
