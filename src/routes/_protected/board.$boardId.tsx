import { createFileRoute } from "@tanstack/react-router"

import { BoardNavbar } from "#/components/board/board-navbar"
import { ListContainer } from "#/components/board/list-container"
import { ScreenReaderAnnouncements } from "#/components/board/screen-reader-announcements"
import CardModal from "#/components/modals/card-modal"
import { OptimisticBoardProvider } from "#/hooks/use-optimistic-board"

export const Route = createFileRoute("/_protected/board/$boardId")({
  component: BoardIdPage,
  loader: ({ context, params }) => {
    const boardId = Number(params.boardId)

    context.queryClient.prefetchQuery(
      context.trpc.board.getBoardById.queryOptions({
        boardId,
        orgId: context.orgId,
      }),
    )

    context.queryClient.prefetchQuery(context.trpc.list.getlistsWithCards.queryOptions({ boardId }))

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
        <ScreenReaderAnnouncements announcement="" />

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
