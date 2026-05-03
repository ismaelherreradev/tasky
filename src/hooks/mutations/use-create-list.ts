import { useMutation, useQueryClient } from "@tanstack/react-query"

import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
import { useTRPC } from "#/integrations/trpc/react"
import type { ListSelect } from "#/server/db/schema"

interface UseCreateListOptions {
  boardId: number
  onSuccess?: (data: ListSelect) => void
}

export function useCreateList({ boardId, onSuccess }: UseCreateListOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.list.createList.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(trpc.list.getlistsWithCards.queryKey({ boardId }), (old) =>
          old ? [...old, { ...data, cards: [] }] : [{ ...data, cards: [] }],
        )
        toastSuccess(`List "${data.title}" created!`)
        onSuccess?.(data)
      },
      onError: (error) => {
        const message = extractZodError(error, "title", "Failed to create list")
        toastError(message)
      },
    }),
  })

  return mutation
}
