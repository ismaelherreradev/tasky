import { DotsThreeIcon, TrashIcon, XIcon } from "@phosphor-icons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { Button } from "#/components/ui/button"
import { ConfirmationDialog } from "#/components/ui/confirmation-dialog"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "#/components/ui/popover"
import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"

type BoardOptionsProps = { boardId: number; orgId: string }

export function BoardOptions({ boardId, orgId }: BoardOptionsProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPopover, setShowPopover] = useState(false)

  const navigate = useNavigate()

  const { mutate, isPending } = useMutation(
    trpc.board.deleteBoard.mutationOptions({
      onMutate: () => {
        navigate({ to: "/organization/$orgId", params: { orgId } })
      },
      onSuccess: () => {
        toastManager.add({ title: "Success", description: "Board deleted" })
        void queryClient.invalidateQueries({ queryKey: trpc.board.getBoards.queryKey() })
        setShowDeleteDialog(false)
        setShowPopover(false)
      },
      onError: (error) => {
        toastManager.add({ title: "Error", description: error.message })
      },
    }),
  )

  return (
    <>
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger
          render={
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Board options" />
          }
        >
          <DotsThreeIcon size={16} />
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <PopoverClose
            className="absolute inset-e-2 top-2"
            render={
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                aria-label="Close"
                onClick={() => setShowPopover(false)}
              />
            }
          >
            <XIcon size={12} />
          </PopoverClose>
          <div className="pb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Board actions
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-full justify-start px-3 text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
          >
            <TrashIcon size={16} className="mr-2" /> Delete board
          </Button>
        </PopoverContent>
      </Popover>
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Board"
        variant="destructive"
        confirmLabel={isPending ? "Deleting..." : "Delete"}
        isLoading={isPending}
        onConfirm={() => mutate({ boardId })}
        onCancel={() => setShowDeleteDialog(false)}
      >
        <p className="text-sm">Delete board and all lists/cards?</p>
      </ConfirmationDialog>
    </>
  )
}
