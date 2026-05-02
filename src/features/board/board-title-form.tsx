import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"

import { Input } from "#/components/ui/input"
import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"

interface BoardTitleFormProps {
  boardId: number
  orgId: string
  board: BoardSelect | undefined
}
export function BoardTitleForm({ boardId, orgId, board }: BoardTitleFormProps) {
  const trpc = useTRPC()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    ...trpc.board.updateBoard.mutationOptions(),

    onSuccess: (data) => {
      const updatedBoard = data as BoardSelect

      queryClient.setQueryData<BoardSelect>(
        trpc.board.getBoardById.queryOptions({ boardId, orgId }).queryKey,
        (old) => {
          if (!old) return updatedBoard
          return { ...old, ...updatedBoard }
        },
      )

      toastManager.add({ title: "Success", id: updatedBoard.title, description: "Board title updated" })
      setIsEditing(false)
    },
    onError: (error) => {
      toastManager.add({ title: "Error", description: error.message })
    },
  })

  useEffect(() => {
    if (board?.title) setTitle(board.title)
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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isPending) return

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      toastManager.add({ title: "Error", description: "Title cannot be empty" })
      return
    }

    if (trimmedTitle === board?.title) {
      setIsEditing(false)
      return
    }

    mutate({ boardId, title: trimmedTitle })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") disableEditing()
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (isEditing && !isPending)
        handleSubmit(new Event("submit") as unknown as React.SubmitEvent<HTMLFormElement>)
    }, 100)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-x-2">
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
