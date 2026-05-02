import { LayoutIcon, TrashIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"

import { Button } from "#/components/ui/button"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"
import { ConfirmationDialog } from "#/components/ui/confirmation-dialog"
import type { BoardSelect } from "#/server/db/schema"

interface BoardCardProps {
  board: BoardSelect
  onDelete: (boardId: number) => void
  isDeleting: boolean
}

export function BoardCard({ board, onDelete, isDeleting }: BoardCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteConfirm = () => {
    onDelete(board.id)
  }

  return (
    <>
      <Card className="group relative flex h-36 cursor-pointer flex-col overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <Link
          to="/board/$boardId"
          params={{ boardId: String(board.id) }}
          className="relative z-10 flex-1"
        >
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
        </Link>

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
        confirmLabel={isDeleting ? "Deleting..." : "Delete Board"}
        isLoading={isDeleting}
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
