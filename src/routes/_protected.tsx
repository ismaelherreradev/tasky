import { createFileRoute, Outlet } from "@tanstack/react-router"

import { getSession } from "#/lib/auth.functions"

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => await getSession(),
  component: () => <Outlet />,
})
