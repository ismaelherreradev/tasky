import { CopyIcon, DotsThree, TrashIcon } from "@phosphor-icons/react"
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
import { useCopyList } from "#/hooks/mutations/use-copy-list"
import { useDeleteList } from "#/hooks/mutations/use-delete-list"
import { useUpdateList } from "#/hooks/mutations/use-update-list"
import { toastError } from "#/hooks/utils"
import type { ListSelect } from "#/server/db/schema"

const PRESET_COLORS = [
  "#FFB3BA",
  "#FFDFBA",
  "#FFFFBA",
  "#BAFFC9",
  "#BAE1FF",
  "#E1BAFF",
  "#FFBAE1",
  "#BAFFEC",
]

type ListOptionsProps = {
  data: ListSelect
  boardId: number
  onListDeleted?: () => void
  onListUpdated?: (title: string) => void
}

export default function ListOptions({
  data,
  boardId,
  onListDeleted,
  onListUpdated,
}: ListOptionsProps) {
  const [open, setOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [title, setTitle] = useState(data.title)
  const [color, setColor] = useState(data.color ?? null)

  const { mutate: updateList, isPending: isUpdating } = useUpdateList({
    boardId,
    onSuccess: (updatedList) => {
      setTitle(updatedList.title)
      setColor(updatedList.color ?? null)
      setOpen(false)
      onListUpdated?.(updatedList.title)
    },
  })

  const { mutate: copyList, isPending: isCopying } = useCopyList({
    boardId,
    onSuccess: () => setOpen(false),
  })

  const { mutate: deleteList, isPending: isDeleting } = useDeleteList({
    boardId,
    onSuccess: () => {
      setShowDeleteDialog(false)
      setOpen(false)
      onListDeleted?.()
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
    if (trimmedTitle === data.title && color === data.color) {
      setOpen(false)
      return
    }
    updateList({ title: trimmedTitle, listId: data.id, boardId, color: color ?? undefined })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      setTitle(data.title)
      setColor(data.color ?? null)
    }
  }

  const handleCopy = () => {
    copyList({ listId: data.id, boardId })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            <Button variant="ghost" size="sm" className="h-auto w-auto p-1">
              <DotsThree className="h-4 w-4" />
            </Button>
          }
        />
        <DialogPopup className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>List Settings</DialogTitle>
          </DialogHeader>
          <DialogPanel className="space-y-6">
            <Field>
              <FieldLabel htmlFor="list-title">Title</FieldLabel>
              <Input
                id="list-title"
                name="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                disabled={isUpdating}
              />
            </Field>

            <div className="space-y-2">
              <span className="text-sm font-medium">Color</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setColor(null)}
                  className={`h-6 w-6 rounded-full border-2 border-dashed border-input transition-transform hover:scale-110 focus:ring-2 focus:ring-ring focus:outline-none ${color === null ? "ring-2 ring-ring ring-offset-2" : ""}`}
                  aria-label="No color"
                  aria-pressed={color === null}
                />
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-6 w-6 rounded-full transition-transform hover:scale-110 focus:ring-2 focus:ring-ring focus:outline-none ${color === c ? "ring-2 ring-ring ring-offset-2" : ""}`}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                    aria-pressed={color === c}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleCopy}
              disabled={isCopying}
            >
              {isCopying ? (
                <Spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CopyIcon className="mr-2" size={16} />
              )}
              {isCopying ? "Copying..." : "Copy list"}
            </Button>
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
              disabled={isUpdating || !title.trim()}
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
        title="Delete List"
        variant="destructive"
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        isLoading={isDeleting}
        onConfirm={() => deleteList({ listId: data.id, boardId })}
        onCancel={() => setShowDeleteDialog(false)}
      >
        <p className="text-sm">Delete this list and all its cards?</p>
      </ConfirmationDialog>
    </>
  )
}
