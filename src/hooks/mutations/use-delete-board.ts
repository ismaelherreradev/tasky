import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"

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
      onSuccess: () => {
        toastManager.add({ title: "Success", description: "Board deleted" })
        void queryClient.invalidateQueries({ queryKey: trpc.board.getBoards.queryKey({ orgId }) })
        onSuccess?.()
      },
      onError: (error) => {
        toastManager.add({ title: "Error", description: error.message })
      },
    }),
  })

  return mutation
}