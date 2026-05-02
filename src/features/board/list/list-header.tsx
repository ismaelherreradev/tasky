import { type ComponentRef, useRef, useState } from "react"
import { useEventListener } from "usehooks-ts"

import { Input } from "#/components/ui/input"
import { useUpdateList } from "#/hooks/mutations/use-update-list"
import type { ListSelect } from "#/server/db/schema"

import ListOptions from "./list-options"

type ListHeaderProps = {
  data: ListSelect
  onAddCard: () => void
}

export default function ListHeader({ data, onAddCard }: ListHeaderProps) {
  const [title, setTitle] = useState(data.title)
  const [isEditing, setIsEditing] = useState(false)

  const formRef = useRef<ComponentRef<"form">>(null)
  const inputRef = useRef<ComponentRef<"input">>(null)

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    })
  }

  const disableEditing = () => setIsEditing(false)

  const { mutate: updateList } = useUpdateList({
    onSuccess: (updatedList) => {
      setTitle(updatedList.title)
      disableEditing()
    },
  })

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string

    if (title === data.title) return disableEditing()

    updateList({ title, listId: Number(id), boardId: Number(boardId) })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      formRef.current?.requestSubmit()
    }
  }

  useEventListener("keydown", handleKeyDown)

  return (
    <div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
      {isEditing ? (
        <form ref={formRef} action={handleSubmit} className="flex-1 px-0.5">
          <input hidden id="id" name="id" defaultValue={data.id} />
          <input hidden id="boardId" name="boardId" defaultValue={data.boardId} />
          <Input
            id="title"
            name="title"
            ref={inputRef}
            value={title}
            onBlur={() => formRef.current?.requestSubmit()}
            onChange={(e) => setTitle(e.target.value)}
            className="border-transparent px-2 py-1 text-sm font-medium transition hover:border-input focus:border-input"
            placeholder="Enter list title..."
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <button
          type="button"
          onClick={enableEditing}
          className="h-7 w-full border-transparent px-2.5 py-1 text-left text-sm font-medium"
        >
          {title}
        </button>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  )
}
