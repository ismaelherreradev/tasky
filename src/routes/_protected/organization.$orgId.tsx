import { createFileRoute } from "@tanstack/react-router"

import { BoardsClient } from "#/components/organization"

export const Route = createFileRoute("/_protected/organization/$orgId")({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId } = Route.useParams()

  return <BoardsClient initialBoards={[]} orgId={orgId} />
}
