import { useDeleteBoard } from "#/hooks/mutations/use-delete-board"
import type { BoardSelect } from "#/server/db/schema"

import { BoardCard } from "./board-card"
import { BoardEmpty } from "./board-empty"
import { CreateBoardDialog } from "./create-board"

interface BoardsClientProps {
  boards: BoardSelect[] | null
  orgId: string
}

export function BoardsContainer({ boards, orgId }: BoardsClientProps) {
  const {
    mutate: deleteBoard,
    isPending,
    variables,
  } = useDeleteBoard({ orgId })

  return (
    <section className="mt-10 space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold">
            Your Boards
          </h2>
          <p className="text-muted-foreground">
            Organize your projects and collaborate with your team
          </p>
        </div>
        <CreateBoardDialog orgId={orgId} />
      </div>

      {!boards || boards.length === 0 ? (
        <BoardEmpty orgId={orgId} />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((b) => (
            <BoardCard
              key={b.id}
              board={b}
              onDelete={(boardId) => deleteBoard({ boardId })}
              isDeleting={isPending && variables?.boardId === b.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
