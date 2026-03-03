import { createFileRoute } from "@tanstack/react-router"
import { BoardsClient } from "~/components/organization"
import { OrgControl } from "~/components/organization"

export const Route = createFileRoute("/_platform/organization/$id")({
  component: OrganizationIdPage,
})

function OrganizationIdPage() {
  const { orgId } = Route.useRouteContext()
  const { id } = Route.useParams()

  return (
    <>
      <OrgControl id={id} />
      <BoardsClient initialBoards={null} orgId={orgId} />
    </>
  )
}
