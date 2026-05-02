import { DotsThreeIcon, TrashIcon } from "@phosphor-icons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { Button } from "#/components/ui/button"
import { ConfirmationDialog } from "#/components/ui/confirmation-dialog"
import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuGroupLabel,
  MenuSeparator,
  MenuTrigger,
} from "#/components/ui/menu"
import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"

type BoardOptionsProps = { boardId: number; orgId: string; board?: BoardSelect }

export function BoardOptions({ boardId, orgId }: BoardOptionsProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

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
        setShowMenu(false)
      },
      onError: (error) => {
        toastManager.add({ title: "Error", description: error.message })
      },
    }),
  )

  return (
    <>
      <Menu open={showMenu} onOpenChange={setShowMenu}>
        <MenuTrigger
          render={
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Board options">
              <DotsThreeIcon size={16} />
            </Button>
          }
        />
        <MenuPopup className="w-48">
          <MenuGroup>
            <MenuGroupLabel>Board actions</MenuGroupLabel>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
          >
            <TrashIcon size={16} className="mr-2" />
            Delete board
          </MenuItem>
        </MenuPopup>
      </Menu>
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
