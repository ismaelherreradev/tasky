import { QueryClient } from "@tanstack/react-query"
import { createIsomorphicFn } from "@tanstack/react-start"
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import type { ReactNode } from "react"
import superjson from "superjson"

import { TRPCProvider } from "#/integrations/trpc/react"
import type { AppRouter } from "#/server/trpc/router"

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return ""
    return `http://localhost:${process.env.PORT ?? 3000}`
  })()
  return `${base}/api/trpc`
}

const getHeaders = createIsomorphicFn()
  .server(async () => {
    try {
      const { getRequest } = await import("@tanstack/react-start/server")
      const cookie = getRequest().headers.get("cookie")
      return cookie ? { cookie } : {}
    } catch {
      return {}
    }
  })
  .client(() => {
    return {}
  })

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchStreamLink({
      transformer: superjson,
      url: getUrl(),
      headers: () => getHeaders(),
    }),
  ],
})

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })

  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  })
  const context = {
    queryClient,
    trpc: serverHelpers,
  }

  return context
}

export default function TanstackQueryProvider({
  children,
  context,
}: {
  children: ReactNode
  context: ReturnType<typeof getContext>
}) {
  const { queryClient } = context

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  )
}
