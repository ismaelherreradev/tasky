import { useMutation, useQueryClient } from "@tanstack/react-query"

import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
import { useTRPC } from "#/integrations/trpc/react"
import type { ListSelect } from "#/server/db/schema"

interface UseUpdateListOptions {
  boardId: number
  onSuccess?: (data: ListSelect) => void
}

export function useUpdateList({ boardId, onSuccess }: UseUpdateListOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.list.updateList.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(trpc.list.getlistsWithCards.queryKey({ boardId }), (old) =>
          old?.map((list) => (list.id === data.id ? { ...list, ...data } : list)),
        )
        toastSuccess(`Updated "${data.title}"`)
        onSuccess?.(data)
      },
      onError: (error) => {
        const message = extractZodError(error, "title", "Failed to update list")
        toastError(message)
      },
    }),
  })

  return mutation
}
