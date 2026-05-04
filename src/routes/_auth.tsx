import { useAuth } from "@clerk/tanstack-react-start"
import { createFileRoute, Outlet } from "@tanstack/react-router"

import { Navbar } from "#/components/navbar"
import { getSession, getSessionAuthOnly } from "#/lib/auth.functions"

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/select-org") {
      const session = await getSessionAuthOnly()
      return { userId: session.userId, orgId: undefined }
    }
    return await getSession()
  },
  loader: async ({ context }) => {
    return { userId: context.userId, orgId: context.orgId }
  },
  component: ProtectedAppLayout,
})

function ProtectedAppLayout() {
  const { orgId } = Route.useLoaderData()
  const { orgId: clientOrgId } = useAuth()

  const displayOrgId = orgId || clientOrgId

  return (
    <>
      {displayOrgId ? <Navbar orgId={displayOrgId} /> : null}
      <Outlet />
    </>
  )
}
