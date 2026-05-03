import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"

interface UseDeleteListOptions {
  boardId: number
  onSuccess?: () => void
}

export function useDeleteList({ boardId, onSuccess }: UseDeleteListOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.list.deleteList.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(trpc.list.getlistsWithCards.queryKey({ boardId }), (old) =>
          old?.filter((list) => list.id !== data.id),
        )
        toastManager.add({
          title: "Success",
          id: String(data.id),
          description: `List "${data.title}" deleted!`,
        })
        onSuccess?.()
      },
      onError: (error) => {
        toastManager.add({ title: "Error", description: error.message })
      },
    }),
  })

  return mutation
}
