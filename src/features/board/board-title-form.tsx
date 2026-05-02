import { useEffect, useRef, useState } from "react"

import { Input } from "#/components/ui/input"
import { useUpdateBoard } from "#/hooks/mutations/use-update-board"
import { toastError } from "#/hooks/utils"
import type { BoardSelect } from "#/server/db/schema"

interface BoardTitleFormProps {
  boardId: number
  orgId: string
  board: BoardSelect | undefined
}
export function BoardTitleForm({ boardId, orgId, board }: BoardTitleFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")

  const { mutate, isPending } = useUpdateBoard({
    boardId,
    orgId,
    onSuccess: (updatedBoard) => {
      setTitle(updatedBoard.title)
      setIsEditing(false)
    },
  })

  useEffect(() => {
    if (board?.title) {
      setTitle(board.title)
    }
  }, [board?.title])

  const enableEditing = () => {
    setIsEditing(true)
    if (board?.title) setTitle(board.title)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const disableEditing = () => {
    setIsEditing(false)
    if (board?.title) setTitle(board.title)
  }

  const handleSubmit = () => {
    if (isPending) return

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      toastError("Title cannot be empty")
      return
    }

    if (trimmedTitle === board?.title) {
      setIsEditing(false)
      return
    }

    mutate({ boardId, title: trimmedTitle })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") disableEditing()
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (isEditing && !isPending) handleSubmit()
    }, 100)
  }

  if (isEditing) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="flex items-center gap-x-2">
        <Input
          ref={inputRef}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-7 border-none bg-transparent px-1.75 py-1 text-lg font-bold shadow-sm transition-colors focus-visible:bg-white dark:focus-visible:bg-muted"
          disabled={isPending}
        />
      </form>
    )
  }

  return (
    <button
      type="button"
      onClick={enableEditing}
      className="h-auto rounded-sm p-1 px-2 text-left text-lg font-bold transition-colors hover:bg-muted/50"
      disabled={isPending}
    >
      {board?.title ?? "Loading..."}
    </button>
  )
}