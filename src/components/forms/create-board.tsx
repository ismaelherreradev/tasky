import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TRPCClientError } from "@trpc/client"
import { Plus } from "lucide-react"
import { isValidElement, useState } from "react"

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
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/old/server/db/schema"

import { toastManager } from "../ui/toast"

type CreateBoardDialogProps = {
  orgId: string
  children?: React.ReactNode
}

export function CreateBoardDialog({ children, orgId }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    ...trpc.board.create.mutationOptions(),
    onSuccess: (data) => {
      const board = data as BoardSelect

      queryClient.setQueryData<BoardSelect[]>(
        trpc.board.getBoards.queryOptions({ orgId }).queryKey,
        (old) => {
          if (!old) return [board]
          return [...old, board]
        },
      )

      setOpen(false)
      setTitle("")

      //     router.push(`/board/${data?.id}`);
    },
    onError: (error) => {
      const message =
        error instanceof TRPCClientError
          ? (error.data?.zodError?.fieldErrors?.boardId?.[0] ?? error.message)
          : "Failed to create board. Please try again."

      toastManager.add({ title: "Error", description: message })
    },
  })

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) {
      toastManager.add({ title: "Error", description: "Board title is required" })
      return
    }
    mutate({ title: title.trim(), orgId })
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setTitle("")
    }
  }

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus size={16} />
      Create Board
    </Button>
  )

  const trigger = isValidElement(children) ? children : defaultTrigger

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} nativeButton={false} />
      <DialogPopup className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={18} className="text-primary" />
            New Board
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="contents">
          <DialogPanel className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="board-title">Board Title</Label>
              <Input
                id="board-title"
                name="title"
                type="text"
                placeholder="e.g. My Project Board"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-required="true"
                autoFocus
              />
            </div>
          </DialogPanel>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <DialogClose render={<Button variant="outline" />} disabled={isPending}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending || !title.trim()} className="gap-2">
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Board
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  )
}
