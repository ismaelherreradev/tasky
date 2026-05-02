import { createFileRoute, Outlet } from "@tanstack/react-router"

import { Navbar } from "#/components/navbar"
import { getSession } from "#/lib/auth.functions"

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => await getSession(),
  loader: async ({ context }) => {
    return { userId: context.userId, orgId: context.orgId }
  },
  component: ProtectedAppLayout,
})

function ProtectedAppLayout() {
  const { orgId } = Route.useLoaderData()

  return (
    <>
      {orgId ? <Navbar orgId={orgId} /> : null}

      <Outlet />
    </>
  )
}
