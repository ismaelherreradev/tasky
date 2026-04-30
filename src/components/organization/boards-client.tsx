import { LayoutIcon, TrashIcon, PlusIcon } from "@phosphor-icons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TRPCClientError } from "@trpc/client"
import { useState } from "react"

import { CreateBoardDialog } from "#/components/forms"
import { Button } from "#/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { ConfirmationDialog } from "#/components/ui/confirmation-dialog"
import type { BoardSelect } from "#/db/schema"
import { useTRPC } from "#/integrations/trpc/react"

import { toastManager } from "../ui/toast"

function BoardCard({ board, orgId }: { board: BoardSelect; orgId: string }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    ...trpc.board.deleteBoard.mutationOptions(),
    onSuccess: () => {
      queryClient.setQueryData(trpc.board.getBoards.queryOptions({ orgId }).queryKey, (old) =>
        old?.filter((b) => b.id !== board.id),
      )
    },
    onError: (error) => {
      const message =
        error instanceof TRPCClientError
          ? (error.data?.zodError?.fieldErrors?.boardId?.[0] ?? error.message)
          : "Failed to delete board. Please try again."

      toastManager.add({ title: "Error", description: message })
    },
  })

  const handleDeleteConfirm = () => {
    mutate({ boardId: board.id })
  }

  return (
    <>
      <Card className="group relative flex h-36 cursor-pointer flex-col overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <CardHeader className="shrink-0 pb-3">
          <CardTitle className="flex items-center gap-3 pr-10 text-lg font-bold transition-colors group-hover:text-primary">
            <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
              <LayoutIcon size={18} className="text-primary" />
            </div>
            <span className="truncate">{board.title}</span>
          </CardTitle>
          <CardDescription className="text-sm opacity-70 transition-opacity group-hover:opacity-90">
            Created{" "}
            {board.createdAt
              ? board.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Unknown date"}
          </CardDescription>
        </CardHeader>

        {/*<Link href={`/board/${board.id}`} className="relative z-10 flex-1">
        </Link>*/}

        <CardAction className="absolute top-4 right-4 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowDeleteDialog(true)
            }}
            className="h-8 w-8 p-0 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
          >
            <TrashIcon size={14} />
          </Button>
        </CardAction>
      </Card>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Board"
        variant="destructive"
        confirmLabel={isPending ? "Deleting..." : "Delete Board"}
        isLoading={isPending}
        onConfirm={handleDeleteConfirm}
      >
        <div className="text-sm text-muted-foreground">
          Are you sure you want to delete this board? This action cannot be undone and will
          permanently delete:
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>All lists in this board</li>
            <li>All cards in those lists</li>
          </ul>
        </div>
      </ConfirmationDialog>
    </>
  )
}

interface BoardsClientProps {
  boards: BoardSelect[] | null
  orgId: string
}

export function BoardsClient({ boards, orgId }: BoardsClientProps) {
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
        <CreateBoardDialog orgId={orgId}>
          <Button size="lg" className="gap-2">
            <PlusIcon size={18} /> Create Board
          </Button>
        </CreateBoardDialog>
      </div>

      {!boards || boards.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="mb-6 rounded-full bg-primary/5 p-6">
            <LayoutIcon size={48} className="text-primary" />
          </div>
          <h3 className="mb-3 text-2xl font-bold">No boards yet</h3>
          <p className="mb-8 max-w-md text-center leading-relaxed text-muted-foreground">
            Create your first board to start organizing your tasks and projects. Boards help you
            visualize your workflow and collaborate effectively.
          </p>
          <CreateBoardDialog orgId={orgId}>
            <Button size="lg" className="gap-2">
              <PlusIcon size={18} /> Create your first board
            </Button>
          </CreateBoardDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CreateBoardDialog orgId={orgId}>
            <Card className="group h-36 cursor-pointer border-2 border-dashed transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md">
              <CardContent className="flex h-full flex-col items-center justify-center space-y-3">
                <div className="rounded-full border-2 border-dashed border-muted-foreground/30 p-3 transition-colors group-hover:border-primary/50">
                  <PlusIcon
                    size={20}
                    className="text-muted-foreground transition-colors group-hover:text-primary"
                  />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
                    Create new board
                  </p>
                  <p className="text-xs text-muted-foreground/70">Start a new project</p>
                </div>
              </CardContent>
            </Card>
          </CreateBoardDialog>

          {boards.map((b) => (
            <BoardCard key={b.id} board={b} orgId={orgId} />
          ))}
        </div>
      )}
    </section>
  )
}
