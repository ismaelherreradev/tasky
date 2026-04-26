import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/organization/$slug")({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()

  return <div>organization {slug}</div>
}
