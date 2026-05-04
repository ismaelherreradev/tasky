import { useMutation, useQueryClient } from "@tanstack/react-query"

import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
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
      onMutate: (variables) => {
        return { orgId: String(orgId) }
      },
      onSuccess: (data) => {
        const board = data
        queryClient.setQueryData<BoardSelect[]>(
          trpc.board.getBoards.queryOptions({ orgId: String(orgId) }).queryKey,
          (old) => (old ? [...old, board] : [board]),
        )
        toastSuccess(`Board "${board.title}" created`)
        onSuccess?.(board)
      },
      onError: (error) => {
        const message = extractZodError(error, "title", "Failed to create board")
        toastError(message)
      },
    }),
  })

  return mutation
}
