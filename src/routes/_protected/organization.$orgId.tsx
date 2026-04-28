import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/organization/$orgId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId } = Route.useParams()

  return (
    <div>
      organization {orgId}
      <Outlet />
    </div>
  )
}
