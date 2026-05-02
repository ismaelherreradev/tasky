import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { BoardsContainer } from "#/features/board/boards-container"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"

export const Route = createFileRoute("/_auth/organization/$orgId")({
  component: OrganizationIdPage,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.board.getBoards.queryOptions({ orgId: context.orgId }),
    )
  },
})

function OrganizationIdPage() {
  const trpc = useTRPC()

  const { orgId } = Route.useParams()
  const { data: boards } = useQuery(trpc.board.getBoards.queryOptions({ orgId }))

  return <BoardsContainer boards={boards as BoardSelect[]} orgId={orgId} />
}