import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "#/integrations/trpc/react"
import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
import type { CardSelect } from "#/server/db/schema"

interface UseCopyCardOptions {
  boardId: number
  onSuccess?: (data: CardSelect) => void
}

export function useCopyCard({ boardId, onSuccess }: UseCopyCardOptions) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...trpc.card.copyCard.mutationOptions({
      onSuccess: (data) => {
        void queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey({ boardId }) })
        toastSuccess(`Card "${data.title}" copied!`)
        onSuccess?.(data)
      },
      onError: (error) => {
        const message = extractZodError(error, "title", "Failed to copy card")
        toastError(message)
      },
    }),
  })

  return mutation
}