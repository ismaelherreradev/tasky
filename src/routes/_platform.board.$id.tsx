import { createFileRoute } from "@tanstack/react-router"
import { getOrgAuth } from "~/server/fns/auth"
import { Provider } from "jotai"
import {
  BoardNavbar,
  ListContainer,
  ScreenReaderAnnouncements,
} from "~/components/board"
import { CardModal } from "~/components/modals"
import { OptimisticBoardProvider } from "~/hooks/use-optimistic-board"

export const Route = createFileRoute("/_platform/board/$id")({
  beforeLoad: async ({ params }) => {
    const { orgId } = await getOrgAuth()
    return { orgId, boardId: Number(params.id) }
  },
  component: BoardIdPage,
})

function BoardIdPage() {
  const { orgId, boardId } = Route.useRouteContext()

  return (
    <Provider>
      <OptimisticBoardProvider boardId={boardId}>
        <main aria-label="Board">
          <h1 className="sr-only">Board</h1>
          <ScreenReaderAnnouncements announcement="" />

          <CardModal />

          <div className="mb-5 space-y-5">
            <BoardNavbar boardId={boardId} orgId={orgId} />

            <section
              aria-label="Board lists and cards"
              aria-describedby="board-instructions"
            >
              <div id="board-instructions" className="sr-only">
                Navigate between lists and cards using Tab and arrow keys. Press
                Enter to open cards or edit items. Drag and drop is supported
                for reordering.
              </div>

              <div role="application" aria-label="Kanban board">
                <ListContainer boardId={boardId} />
              </div>
            </section>
          </div>
        </main>
      </OptimisticBoardProvider>
    </Provider>
  )
}
