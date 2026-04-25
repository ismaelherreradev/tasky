import { createFileRoute, Outlet } from "@tanstack/react-router"

import { getSession } from "#/lib/auth.functions"

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => await getSession(),
  loader: async ({ context }) => {
    return { userId: context.userId }
  },
  component: () => <Outlet />,
})
