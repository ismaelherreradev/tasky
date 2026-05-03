import { createFileRoute } from "@tanstack/react-router"

import { BoardNavbar } from "#/features/board/board-navbar"
import { CardModal } from "#/features/board/card/card-modal"
import { ListContainer } from "#/features/board/list/list-container"
import { OptimisticBoardProvider } from "#/hooks/use-optimistic-board"

export const Route = createFileRoute("/_auth/board/$boardId")({
  component: BoardIdPage,
  loader: async ({ context, params }) => {
    const boardId = Number(params.boardId)

    await context.queryClient.prefetchQuery(
      context.trpc.board.getBoardById.queryOptions({
        boardId,
        orgId: context.orgId,
      }),
    )

    await context.queryClient.prefetchQuery(
      context.trpc.list.getlistsWithCards.queryOptions({ boardId }),
    )

    return {
      orgId: context.orgId,
    }
  },
})

function BoardIdPage() {
  const params = Route.useParams()
  const loader = Route.useLoaderData()
  const boardId = Number(params.boardId)
  const orgId = loader.orgId

  if (!boardId) {
    return null
  }

  return (
    <OptimisticBoardProvider boardId={boardId}>
      <main className="flex h-[calc(100vh-4rem)] flex-col" aria-label={`Board`}>
        <h1 className="sr-only">Board</h1>

        <CardModal />

        <BoardNavbar boardId={boardId} orgId={orgId} />

        <section
          className="min-h-0 flex-1"
          aria-label="Board lists and cards"
          aria-describedby="board-instructions"
        >
          <div id="board-instructions" className="sr-only">
            Navigate between lists and cards using Tab and arrow keys. Press Enter to open cards or
            edit items. Drag and drop is supported for reordering.
          </div>

          <div role="application" className="h-full" aria-label="Kanban board">
            <ListContainer boardId={boardId} />
          </div>
        </section>
      </main>
    </OptimisticBoardProvider>
  )
}
