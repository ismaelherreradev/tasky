import { FileTextIcon, LayoutIcon, TrashIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"

import { Button } from "#/components/ui/button"
import { Card } from "#/components/ui/card"
import { ConfirmationDialog } from "#/components/ui/confirmation-dialog"
import type { BoardSelect } from "#/server/db/schema"

interface BoardCardProps {
  board: BoardSelect
  listCount?: number
  cardCount?: number
  isDeleting?: boolean
  onDelete?: () => void
}

export function BoardCard({
  board,
  listCount = 0,
  cardCount = 0,
  isDeleting = false,
  onDelete,
}: BoardCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteConfirm = () => {
    onDelete?.()
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="group relative flex h-32 flex-col overflow-hidden transition-colors hover:bg-muted/40">
        <Link
          to="/board/$boardId"
          params={{ boardId: String(board.id) }}
          className="relative z-10 flex flex-1 flex-col justify-between p-5"
        >
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <LayoutIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              <h3 className="truncate font-semibold tracking-tight text-foreground">
                {board.title}
              </h3>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {board.createdAt
              ? `Created ${board.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`
              : "Unknown date"}
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <LayoutIcon size={12} />
                <span>{listCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileTextIcon size={12} />
                <span>{cardCount}</span>
              </div>
            </div>
          </div>
        </Link>

        <div className="absolute top-3 right-3 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowDeleteDialog(true)
            }}
            className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100"
          >
            <TrashIcon className="h-4 w-4" />
            <span className="sr-only">Delete board</span>
          </Button>
        </div>
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
