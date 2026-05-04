import { auth } from "@clerk/tanstack-react-start/server"
import type { D1Database } from "@cloudflare/workers-types"
import { createFileRoute } from "@tanstack/react-router"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { env as cloudflareEnv } from "cloudflare:workers"

import { createTRPCContext } from "#/server/trpc/init"
import { appRouter } from "#/server/trpc/router"

function handler({ request }: { request: Request }) {
  const headers = request.headers

  const env = cloudflareEnv as { DB: D1Database }

  if (!env?.DB) {
    throw new Error("D1 database binding 'DB' not found in environment")
  }

  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: async () => {
      const authData = await auth()
      return createTRPCContext({
        headers,
        auth: authData,
        env,
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
