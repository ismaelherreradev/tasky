import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
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
        void queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey({ boardId }) })
        toastManager.add({
          title: "Success",
          id: String(data.id),
          description: `List "${data.title}" created!`,
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
    return zodError.fieldErrors[field]?.[0] ?? "Failed to create list"
  }
  return "Failed to create list"
}