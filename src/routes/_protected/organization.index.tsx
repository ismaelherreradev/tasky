import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/organization/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>index </div>
}
