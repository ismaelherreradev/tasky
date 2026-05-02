import { PlusIcon } from "@phosphor-icons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"

import { Button } from "#/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog"
import { Field, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"
import { Spinner } from "@/components/ui/spinner"

type CreateBoardDialogProps = {
  orgId: number | string
}

export function CreateBoardDialog({ orgId }: CreateBoardDialogProps): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    ...trpc.board.create.mutationOptions(),
    onSuccess: (data) => {
      const board = data as BoardSelect
      queryClient.setQueryData<BoardSelect[]>(
        trpc.board.getBoards.queryOptions({ orgId }).queryKey,
        (old) => (old ? [...old, board] : [board]),
      )
      setOpen(false)
      setTitle("")
      navigate({ to: "/board/$boardId", params: { boardId: String(data.id) } })
    },
    onError: (error) => {
      toastManager.add({ title: "Error", description: error.message })
    },
  })

  const form = useForm({
    defaultValues: {
      title: "",
      orgId: String(orgId),
    },
    onSubmit: ({ value }) => {
      if (!value.title.trim()) {
        toastManager.add({ title: "Error", description: "Title is required" })
        return
      }
      mutate(value)
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setTitle("")
      form.reset()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toastManager.add({ title: "Error", description: "Title is required" })
      return
    }
    mutate({ title: title.trim(), orgId: String(orgId) })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <PlusIcon size={16} />
            New Board
          </Button>
        }
      />
      <DialogPopup className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">New Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="contents">
          <DialogPanel className="space-y-4">
            <Field>
              <FieldLabel htmlFor="board-title">Title</FieldLabel>
              <Input
                id="board-title"
                name="title"
                type="text"
                placeholder="e.g. My Project Board"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </Field>
          </DialogPanel>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <DialogClose render={<Button variant="ghost" />} disabled={isPending}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || !title.trim()}
              className="gap-2"
            >
              {isPending ? <Spinner /> : null}
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  )
}