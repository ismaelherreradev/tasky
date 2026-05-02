import { createFileRoute, Outlet } from "@tanstack/react-router"

import { getSessionAuthOnly } from "#/lib/auth.functions"

export const Route = createFileRoute("/_authSelectOrg")({
  beforeLoad: async () => await getSessionAuthOnly(),
  loader: async ({ context }) => {
    return { userId: context.userId }
  },
  component: AuthOnlyLayout,
})

function AuthOnlyLayout() {
  return <Outlet />
}