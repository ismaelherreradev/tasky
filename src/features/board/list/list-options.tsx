import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { MoreHorizontal } from "lucide-react"

import { Spinner } from "#/components/ui/spinner"
import { Button } from "#/components/ui/button"
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
import type { ListSelect } from "#/server/db/schema"

type ListOptionsProps = {
  data: ListSelect
  onAddCard: () => void
}

export default function ListOptions({ data, onAddCard }: ListOptionsProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const deleteList = useMutation({
    ...trpc.list.deleteList.mutationOptions(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey() })
      setOpen(false)

      toastManager.add({
        title: "Success",
        id: data.title,
        description: `List "${data.title}" deleted!`,
      })
    },
    onError: () => {
      setOpen(false)
    },
  })

  const copyList = useMutation({
    ...trpc.list.copyList.mutationOptions(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey() })
      setOpen(false)

      toastManager.add({
        title: "Success",
        id: data.title,
        description: `List "${data.title}" copied!`,
      })
    },
    onError: () => {
      setOpen(false)
    },
  })

  function onDelete(formData: FormData) {
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    deleteList.mutate({ listId: Number(id), boardId: Number(boardId) })
  }

  function onCopy(formData: FormData) {
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    copyList.mutate({ listId: Number(id), boardId: Number(boardId) })
  }

  return (
    <Menu open={open} onOpenChange={setOpen}>
      <MenuTrigger render={<Button variant="ghost" size="sm" className="h-auto w-auto p-1" />}>
        <MoreHorizontal className="h-4 w-4" />
      </MenuTrigger>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel className="px-3 py-2 text-center text-sm font-medium">
            List actions
          </MenuGroupLabel>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem
          className="px-3"
          closeOnClick
          onClick={(e) => {
            e.preventDefault()
            onAddCard()
          }}
        >
          Add card
        </MenuItem>
        <form action={onCopy}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input hidden name="boardId" id="boardId" defaultValue={data.boardId} />
          <MenuItem
            className="px-3"
            disabled={copyList.isPending}
            closeOnClick={false}
            onClick={(e) => {
              e.preventDefault()
              const form = e.currentTarget.closest("form")
              if (form) form.requestSubmit()
            }}
          >
            {copyList.isPending ? (
              <>
                <Spinner className="h-4 w-4 animate-spin" />
                Copying...
              </>
            ) : (
              "Copy list"
            )}
          </MenuItem>
        </form>
        <MenuSeparator />
        <form action={onDelete}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input hidden name="boardId" id="boardId" defaultValue={data.boardId} />
          <MenuItem
            className="px-3 text-destructive hover:bg-destructive/10"
            disabled={deleteList.isPending}
            closeOnClick={false}
            onClick={(e) => {
              e.preventDefault()
              const form = e.currentTarget.closest("form")
              if (form) form.requestSubmit()
            }}
          >
            {deleteList.isPending ? (
              <>
                <Spinner className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete this list"
            )}
          </MenuItem>
        </form>
      </MenuPopup>
    </Menu>
  )
}
