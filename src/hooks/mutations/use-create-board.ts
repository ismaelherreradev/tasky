import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"

interface UseCreateBoardOptions {
  orgId: number | string
  onSuccess?: (data: BoardSelect) => void
}

export function useCreateBoard({ orgId, onSuccess }: UseCreateBoardOptions = { orgId: 0 }) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.board.create.mutationOptions({
      onSuccess: (data) => {
        const board = data as BoardSelect
        queryClient.setQueryData<BoardSelect[]>(
          trpc.board.getBoards.queryOptions({ orgId: Number(orgId) }).queryKey,
          (old) => (old ? [...old, board] : [board]),
        )
        toastManager.add({
          title: "Success",
          description: `Board "${board.title}" created`,
        })
        onSuccess?.(board)
      },
      onError: (error) => {
        const message = extractErrorMessage(error, "boardId")
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
    return zodError.fieldErrors[field]?.[0] ?? "Failed to create board"
  }
  return "Failed to create board"
}