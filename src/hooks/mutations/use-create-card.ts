import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "#/integrations/trpc/react"
import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
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
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: trpc.card.getCardsByListId.queryKey({ listId }) })
        await queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey({ boardId }) })
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