import { useMutation, useQueryClient } from "@tanstack/react-query"

import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
import { useTRPC } from "#/integrations/trpc/react"
import type { CardSelect } from "#/server/db/schema"

interface UseCreateCardOptions {
  listId: number
  boardId: number
  onSuccess?: (data: CardSelect) => void
}

export function useCreateCard({ listId, boardId, onSuccess }: UseCreateCardOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.card.createCard.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(trpc.list.getlistsWithCards.queryKey({ boardId }), (old) =>
          old?.map((list) =>
            list.id === listId ? { ...list, cards: [...(list.cards || []), data] } : list,
          ),
        )
        toastSuccess(`Card "${data.title}" created!`)
        onSuccess?.(data)
      },
      onError: (error) => {
        const message = extractZodError(error, "title", "Failed to create card")
        toastError(message)
      },
    }),
  })

  return mutation
}
