import { createFileRoute } from "@tanstack/react-router"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { createTRPCContext } from "#/integrations/trpc/init"
import { appRouter } from "#/integrations/trpc/router"

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: createTRPCContext,
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
