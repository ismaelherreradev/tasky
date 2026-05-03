import { GearIcon, TrashIcon } from "@phosphor-icons/react"
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
import { useDeleteBoard } from "#/hooks/mutations/use-delete-board"
import type { BoardSelect } from "#/server/db/schema"

type BoardOptionsProps = { boardId: number; orgId: string; board?: BoardSelect }

export function BoardOptions({ boardId, orgId }: BoardOptionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const navigate = useNavigate()

  const { mutate, isPending } = useDeleteBoard({
    orgId,
    onMutate: () => {
      navigate({ to: "/organization/$orgId", params: { orgId } })
    },
    onSuccess: () => {
      setShowDeleteDialog(false)
      setShowMenu(false)
    },
  })

  return (
    <>
      <Menu open={showMenu} onOpenChange={setShowMenu}>
        <MenuTrigger
          render={
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0" aria-label="Board options">
              <GearIcon size={16} />
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
