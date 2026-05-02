import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"

interface UseDeleteCardOptions {
  boardId: number
  onSuccess?: (data: { id: number; title: string }) => void
}

export function useDeleteCard({ boardId, onSuccess }: UseDeleteCardOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.card.deleteCard.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey({ boardId }) })
        toastManager.add({
          title: "Success",
          id: String(data.id),
          description: `Card "${data.title}" deleted!`,
        })
        onSuccess?.(data)
      },
      onError: (error) => {
        toastManager.add({ title: "Error", description: error.message })
      },
    }),
  })

  return mutation
}