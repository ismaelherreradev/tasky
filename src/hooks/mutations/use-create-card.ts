import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
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
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: trpc.card.getCardsByListId.queryKey({ listId }) })
        await queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey({ boardId }) })
        toastManager.add({
          title: "Success",
          id: String(data.id),
          description: `Card "${data.title}" created!`,
        })
        onSuccess?.(data)
      },
      onError: (error) => {
        const message = extractErrorMessage(error, "title")
        toastManager.add({ title: "Error", description: message })
      },
    }),
  })

  return mutation
}

function extractErrorMessage(error: unknown, field: string): string {
  const err = error as { data?: { zodError?: { fieldErrors?: Record<string, string[]> } } }
  const zodError = err.data?.zodError
  if (zodError && "fieldErrors" in zodError && zodError.fieldErrors) {
    return zodError.fieldErrors[field]?.[0] ?? "Failed to create card"
  }
  return "Failed to create card"
}