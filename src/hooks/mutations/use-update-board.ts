import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"

interface UseUpdateBoardOptions {
  boardId: number
  orgId: string
  onSuccess?: (data: BoardSelect) => void
}

export function useUpdateBoard({ boardId, orgId, onSuccess }: UseUpdateBoardOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.board.updateBoard.mutationOptions({
      onSuccess: (data) => {
        const board = data as BoardSelect
        queryClient.setQueryData<BoardSelect>(
          trpc.board.getBoardById.queryOptions({ boardId, orgId }).queryKey,
          (old) => (old ? { ...old, ...board } : board),
        )
        toastManager.add({ title: "Success", id: String(board.id), description: "Board title updated" })
        onSuccess?.(board)
      },
      onError: (error) => {
        const message = extractErrorMessage(error, "title")
        toastManager.add({ title: "Error", description: message })
      },
    }),
  })

  return mutation
}

function extractErrorMessage(error: unknown, field: string): string {
  const err = error as { data?: { zodError?: { fieldErrors?: Record<string, string[]> } } }
  const zodError = err.data?.zodError
  if (zodError && "fieldErrors" in zodError && zodError.fieldErrors) {
    return zodError.fieldErrors[field]?.[0] ?? "Failed to update board"
  }
  return "Failed to update board"
}