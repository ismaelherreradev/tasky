import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"
import type { CardSelect } from "#/server/db/schema"

interface UseUpdateCardOptions {
  invalidateCardQuery?: boolean
  onSuccess?: (data: CardSelect) => void
}

export function useUpdateCard({ invalidateCardQuery = false, onSuccess }: UseUpdateCardOptions = {}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.card.updateCard.mutationOptions({
      onSuccess: (data) => {
        if (invalidateCardQuery) {
          void queryClient.invalidateQueries({ queryKey: trpc.card.getCardById.queryKey({ id: data.id }) })
        }
        toastManager.add({
          title: "Success",
          id: String(data.id),
          description: `Card "${data.title}" updated`,
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
    return zodError.fieldErrors[field]?.[0] ?? "Failed to update card"
  }
  return "Failed to update card"
}