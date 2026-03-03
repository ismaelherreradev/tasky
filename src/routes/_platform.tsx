import { createFileRoute, Outlet } from "@tanstack/react-router"
import { getOrgAuth } from "~/server/fns/auth"
import { Navbar } from "~/components/navigation"

export const Route = createFileRoute("/_platform")({
  beforeLoad: async () => await getOrgAuth(),
  component: PlatformLayout,
})

function PlatformLayout() {
  const { orgId } = Route.useRouteContext()

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar orgId={orgId} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
