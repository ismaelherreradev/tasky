import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"
import type { ListSelect } from "#/server/db/schema"

interface UseCopyListOptions {
  boardId: number
  onSuccess?: (data: ListSelect) => void
}

export function useCopyList({ boardId, onSuccess }: UseCopyListOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.list.copyList.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({
          queryKey: trpc.list.getlistsWithCards.queryKey({ boardId }),
        })
        toastManager.add({
          title: "Success",
          id: String(data.id),
          description: `List "${data.title}" copied!`,
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
