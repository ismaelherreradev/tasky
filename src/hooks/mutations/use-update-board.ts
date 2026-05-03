import { useMutation, useQueryClient } from "@tanstack/react-query"

import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
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
        toastSuccess("Board title updated", `Board "${board.title}"`)
        onSuccess?.(board)
      },
      onError: (error) => {
        const message = extractZodError(error, "title", "Failed to update board")
        toastError(message)
      },
    }),
  })

  return mutation
}
