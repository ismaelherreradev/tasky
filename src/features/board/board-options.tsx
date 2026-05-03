import { GearIcon, TrashIcon } from "@phosphor-icons/react"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { Button } from "#/components/ui/button"
import { ConfirmationDialog } from "#/components/ui/confirmation-dialog"
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog"
import { Field, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { Spinner } from "#/components/ui/spinner"
import { useDeleteBoard } from "#/hooks/mutations/use-delete-board"
import { useUpdateBoard } from "#/hooks/mutations/use-update-board"
import { toastError } from "#/hooks/utils"
import type { BoardSelect } from "#/server/db/schema"

import { BoardStats } from "./board-stats"

type BoardOptionsProps = { boardId: number; orgId: string; board?: BoardSelect }

export function BoardOptions({ boardId, orgId, board }: BoardOptionsProps) {
  const [open, setOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [title, setTitle] = useState(board?.title ?? "")

  const navigate = useNavigate()

  const { mutate: updateBoard, isPending: isUpdating } = useUpdateBoard({
    boardId,
    orgId,
    onSuccess: (updatedBoard) => {
      setTitle(updatedBoard.title)
      setOpen(false)
    },
  })

  const { mutate: deleteBoard, isPending: isDeleting } = useDeleteBoard({
    orgId,
    onMutate: () => {
      navigate({ to: "/organization/$orgId", params: { orgId } })
    },
    onSuccess: () => {
      setShowDeleteDialog(false)
      setOpen(false)
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toastError("Title cannot be empty")
      return
    }
    if (trimmedTitle === board?.title) {
      setOpen(false)
      return
    }
    updateBoard({ boardId, title: trimmedTitle })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && board?.title) {
      setTitle(board.title)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0" aria-label="Board settings">
              <GearIcon size={16} />
            </Button>
          }
        />
        <DialogPopup className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Board Settings</DialogTitle>
          </DialogHeader>
          <DialogPanel className="space-y-6">
            <div className="space-y-1">
              <BoardStats boardId={boardId} variant="detailed" />
            </div>

            <Field>
              <FieldLabel htmlFor="board-title">Title</FieldLabel>
              <Input
                id="board-title"
                name="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                disabled={isUpdating}
              />
            </Field>
          </DialogPanel>
          <DialogFooter className="gap-2">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <TrashIcon size={16} className="mr-2" />
              Delete
            </Button>
            <Button
              onClick={handleTitleSubmit}
              disabled={isUpdating || isDeleting || !title.trim()}
              className="gap-2"
            >
              {isUpdating ? <Spinner /> : null}
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Board"
        variant="destructive"
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        isLoading={isDeleting}
        onConfirm={() => deleteBoard({ boardId })}
        onCancel={() => setShowDeleteDialog(false)}
      >
        <p className="text-sm">Delete board and all lists/cards?</p>
      </ConfirmationDialog>
    </>
  )
}
