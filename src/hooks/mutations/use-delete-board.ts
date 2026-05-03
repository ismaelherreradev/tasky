import { useMutation, useQueryClient } from "@tanstack/react-query"

import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"

type BoardWithStats = BoardSelect & { listCount: number; cardCount: number }

interface UseDeleteBoardOptions {
  orgId: string
  shouldInvalidate?: boolean
  onMutate?: () => void
  onSuccess?: () => void
}

export function useDeleteBoard({
  orgId,
  shouldInvalidate = false,
  onMutate,
  onSuccess,
}: UseDeleteBoardOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.board.deleteBoard.mutationOptions({
      onMutate: () => {
        onMutate?.()
      },
      onSuccess: async (_, { boardId }) => {
        queryClient.setQueryData(
          trpc.board.getBoardsWithStats.queryKey({ orgId }),
          (old: BoardWithStats[] | undefined) => old?.filter((b) => b.id !== boardId),
        )
        if (shouldInvalidate) {
          await queryClient.invalidateQueries({
            queryKey: trpc.board.getBoardsWithStats.queryKey({ orgId }),
          })
        }
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
