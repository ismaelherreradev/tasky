import { useMutation, useQueryClient } from "@tanstack/react-query"

import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"

interface UseDeleteBoardOptions {
  orgId: string
  onMutate?: () => void
  onSuccess?: () => void
}

export function useDeleteBoard({ orgId, onMutate, onSuccess }: UseDeleteBoardOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.board.deleteBoard.mutationOptions({
      onMutate: () => {
        onMutate?.()
      },
      onSuccess: (_, { boardId }) => {
        queryClient.setQueryData<BoardSelect[]>(
          trpc.board.getBoards.queryOptions({ orgId }).queryKey,
          (old) => old?.filter((b) => b.id !== boardId),
        )
        toastSuccess("Board deleted")
        onSuccess?.()
      },
      onError: (error) => {
        const message = extractZodError(error, "boardId", "Failed to delete board")
        toastError(message)
      },
    }),
  })

  return mutation
}
