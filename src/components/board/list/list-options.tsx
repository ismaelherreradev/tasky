import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MoreHorizontal, X } from "lucide-react"
import { type ComponentRef, useRef } from "react"

import { Button } from "#/components/ui/button"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "#/components/ui/popover"
import { Separator } from "#/components/ui/separator"
import { toastManager } from "#/components/ui/toast"
import type { ListSelect } from "#/db/schema"
import { useTRPC } from "#/integrations/trpc/react"

type ListOptionsProps = {
  data: ListSelect
  onAddCard: () => void
}

export default function ListOptions({ data, onAddCard }: ListOptionsProps) {
  const closeRef = useRef<ComponentRef<"button">>(null)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const deleteList = useMutation({
    ...trpc.list.deleteList.mutationOptions(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey() })

      toastManager.add({
        title: "Success",
        id: data.title,
        description: `List "${data.title}" deleted!`,
      })

      closeRef.current?.click()
    },
  })

  const copyList = useMutation({
    ...trpc.list.copyList.mutationOptions(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey() })

      toastManager.add({
        title: "Success",
        id: data.title,
        description: `List "${data.title}" copied!`,
      })

      closeRef.current?.click()
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
    <Popover>
      <PopoverTrigger render={<Button className="h-auto w-auto p-2" variant="ghost" />}>
        <MoreHorizontal className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">List actions</div>
        <PopoverClose
          ref={closeRef}
          render={
            <Button
              className="absolute top-2 right-2 h-auto w-auto p-2 text-neutral-600"
              variant="ghost"
            />
          }
        >
          <X className="h-4 w-4" />
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          variant="ghost"
        >
          Add card...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input hidden name="boardId" id="boardId" defaultValue={data.boardId} />
          <Button
            size="sm"
            type="submit"
            disabled={copyList.isPending}
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          >
            Copy list...
          </Button>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input hidden name="boardId" id="boardId" defaultValue={data.boardId} />
          <Button
            size="sm"
            type="submit"
            disabled={deleteList.isPending}
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          >
            Delete this list
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
