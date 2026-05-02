import { useMutation } from "@tanstack/react-query"

import { useTRPC } from "#/integrations/trpc/react"
import { extractZodError, toastError, toastSuccess } from "#/hooks/utils"
import type { ListSelect } from "#/server/db/schema"

interface UseUpdateListOptions {
  onSuccess?: (data: ListSelect) => void
}

export function useUpdateList({ onSuccess }: UseUpdateListOptions = {}) {
  const trpc = useTRPC()

  const mutation = useMutation({
    ...trpc.list.updateList.mutationOptions({
      onSuccess: (data) => {
        toastSuccess(`Renamed to "${data.title}"`)
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