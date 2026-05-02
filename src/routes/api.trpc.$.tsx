import { createFileRoute } from "@tanstack/react-router"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { auth } from "@clerk/tanstack-react-start/server"

import { createTRPCContext } from "#/server/trpc/init"
import { appRouter } from "#/server/trpc/router"

function handler({ request }: { request: Request }) {
  const headers = request.headers
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: async () => {
      const authData = await auth()
      return createTRPCContext({
        headers,
        auth: authData,
      })
    },
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
