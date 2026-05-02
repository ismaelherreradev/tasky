import { useMutation, useQueryClient } from "@tanstack/react-query"

import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
import { useTRPC } from "#/integrations/trpc/react"
import type { CardSelect } from "#/server/db/schema"

interface UseUpdateCardOptions {
  invalidateCardQuery?: boolean
  onSuccess?: (data: CardSelect) => void
}

export function useUpdateCard({
  invalidateCardQuery = false,
  onSuccess,
}: UseUpdateCardOptions = {}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.card.updateCard.mutationOptions({
      onSuccess: (data) => {
        if (invalidateCardQuery) {
          void queryClient.invalidateQueries({
            queryKey: trpc.card.getCardById.queryKey({ id: data.id }),
          })
          void queryClient.invalidateQueries({
            queryKey: trpc.logs.getAuditLogs.queryKey({ id: data.id }),
          })
        }
        toastSuccess(`Card "${data.title}" updated`)
        onSuccess?.(data)
      },
      onError: (error) => {
        const message = extractZodError(error, "title", "Failed to update card")
        toastError(message)
      },
    }),
  })

  return mutation
}
