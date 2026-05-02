import { useMutation } from "@tanstack/react-query"

import { toastManager } from "#/components/ui/toast"
import { useTRPC } from "#/integrations/trpc/react"
import type { ListSelect } from "#/server/db/schema"

interface UseUpdateListOptions {
  onSuccess?: (data: ListSelect) => void
}

export function useUpdateList({ onSuccess }: UseUpdateListOptions = {}) {
  const trpc = useTRPC()

  const mutation = useMutation({
    ...trpc.list.updateList.mutationOptions({
      onSuccess: (data) => {
        toastManager.add({
          title: "Success",
          id: String(data.id),
          description: `Renamed to "${data.title}"`,
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
    return zodError.fieldErrors[field]?.[0] ?? "Failed to update list"
  }
  return "Failed to update list"
}