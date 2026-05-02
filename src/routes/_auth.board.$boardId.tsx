import { createFileRoute } from "@tanstack/react-router"

import { BoardNavbar } from "#/features/board/board-navbar"
import { CardModal } from "#/features/board/card/card-modal"
import { ListContainer } from "#/features/board/list/list-container"
import { OptimisticBoardProvider } from "#/hooks/use-optimistic-board"

export const Route = createFileRoute("/_auth/board/$boardId")({
  component: BoardIdPage,
  loader: async ({ context, params }) => {
    const boardId = Number(params.boardId)

    await context.queryClient.ensureQueryData(
      context.trpc.board.getBoardById.queryOptions({
        boardId,
        orgId: context.orgId,
      }),
    )

    await context.queryClient.ensureQueryData(
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
      <main aria-label={`Board`}>
        <h1 className="sr-only">Board</h1>

        <CardModal />

        <div className="mb-5 space-y-5">
          <BoardNavbar boardId={boardId} orgId={orgId} />
          <section aria-label="Board lists and cards" aria-describedby="board-instructions">
            <div id="board-instructions" className="sr-only">
              Navigate between lists and cards using Tab and arrow keys. Press Enter to open cards
              or edit items. Drag and drop is supported for reordering.
            </div>

            <div role="application" aria-label="Kanban board">
              <ListContainer boardId={boardId} />
            </div>
          </section>
        </div>
      </main>
    </OptimisticBoardProvider>
  )
}
