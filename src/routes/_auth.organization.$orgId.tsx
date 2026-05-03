import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { BoardsContainer } from "#/features/board/boards-container"
import { useTRPC } from "#/integrations/trpc/react"

export const Route = createFileRoute("/_auth/organization/$orgId")({
  component: OrganizationIdPage,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.board.getBoardsWithStats.queryOptions({ orgId: context.orgId }),
    )
  },
})

function OrganizationIdPage() {
  const trpc = useTRPC()

  const { orgId } = Route.useParams()
  const { data: boards } = useQuery(trpc.board.getBoardsWithStats.queryOptions({ orgId }))

  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <BoardsContainer boards={boards} orgId={orgId} />
    </main>
  )
}
