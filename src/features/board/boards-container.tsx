import { useDeleteBoard } from "#/hooks/mutations/use-delete-board"
import type { BoardSelect } from "#/server/db/schema"

import { BoardCard } from "./board-card"
import { BoardEmpty } from "./board-empty"
import { CreateBoardDialog } from "./create-board"

type BoardWithStats = BoardSelect & { listCount: number; cardCount: number }

interface BoardsClientProps {
  boards: BoardWithStats[] | null | undefined
  orgId: string
}

export function BoardsContainer({ boards, orgId }: BoardsClientProps) {
  const {
    mutate: deleteBoard,
    isPending,
    variables,
  } = useDeleteBoard({ orgId, shouldInvalidate: true })

  return (
    <section className="flex flex-col space-y-8 py-8 md:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h2 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight md:text-4xl">
            Your Boards
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Organize your projects and collaborate with your team
          </p>
        </div>
        <CreateBoardDialog orgId={orgId} />
      </div>

      {!boards || boards.length === 0 ? (
        <BoardEmpty orgId={orgId} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((b) => (
            <BoardCard
              key={b.id}
              board={b}
              listCount={b.listCount}
              cardCount={b.cardCount}
              onDelete={() => deleteBoard({ boardId: b.id })}
              isDeleting={isPending && variables?.boardId === b.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
