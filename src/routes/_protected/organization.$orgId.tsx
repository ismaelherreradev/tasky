import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { BoardsClient } from "#/components/organization"
import type { BoardSelect } from "#/db/schema"
import { useTRPC } from "#/integrations/trpc/react"

export const Route = createFileRoute("/_protected/organization/$orgId")({
  component: OrganizationIdPage,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.board.GetBoards.queryOptions({ orgId: context.orgId }),
    )
  },
})

function OrganizationIdPage() {
  const trpc = useTRPC()

  const { orgId } = Route.useParams()
  const { data: boards } = useQuery(trpc.board.getBoards.queryOptions({ orgId }))

  return <BoardsClient boards={boards as BoardSelect[]} orgId={orgId} />
}
