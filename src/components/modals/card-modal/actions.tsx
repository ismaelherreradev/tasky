import { CopyIcon, DotsThreeCircleIcon, TrashIcon } from "@phosphor-icons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useAtom } from "jotai"

import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"
import { toastManager } from "#/components/ui/toast"
import { onCloseAtom } from "#/hooks/use-card-modal"
import { useTRPC } from "#/integrations/trpc/react"

import type { CardWithList } from "."

type ActionsProps = {
  data: CardWithList
}

export default function Actions({ data }: ActionsProps) {
  const params = useParams({ from: "/_protected/board/$boardId" })
  const [, onClose] = useAtom(onCloseAtom)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate: copyCard, isPending: isCopying } = useMutation({
    ...trpc.card.copyCard.mutationOptions(),
    onSuccess: (data) => {
      onClose()

      void queryClient.invalidateQueries({
        queryKey: trpc.list.getlistsWithCards.queryKey({ boardId: Number(params.boardId) }),
      })

      toastManager.add({
        title: "Success",
        id: data.title,
        description: `Card "${data.title}" copied!`,
      })
    },
    onError: (error) => {
      const errorMessage =
        (
          error as {
            data?: { zodError?: { fieldErrors?: { title?: string } } }
          }
        )?.data?.zodError?.fieldErrors?.title ?? "Failed to copy card"

      toastManager.add({
        title: "Error",
        id: data.title,
        description: errorMessage,
      })
    },
  })

  const { mutate: deleteCard, isPending: isDeleting } = useMutation({
    ...trpc.card.deleteCard.mutationOptions(),
    onSuccess: (data) => {
      onClose()

      void queryClient.invalidateQueries({
        queryKey: trpc.list.getlistsWithCards.queryKey({ boardId: Number(params.boardId) }),
      })

      toastManager.add({
        title: "Success",
        id: data.title,
        description: `Card "${data.title}" deleted!`,
      })
    },
    onError: (error) => {
      const errorMessage =
        (
          error as {
            data?: { zodError?: { fieldErrors?: { title?: string } } }
          }
        )?.data?.zodError?.fieldErrors?.title ?? "Failed to delete card"
      toastManager.add({
        title: "Error",
        id: data.title,
        description: errorMessage,
      })
    },
  })

  const handleCopy = () => {
    const boardId = Number(params.boardId)
    if (Number.isNaN(boardId)) {
      toastManager.add({
        title: "Error",
        description: "Invalid board ID",
      })
      return
    }

    copyCard({
      id: data.id,
      boardId,
    })
  }

  const handleDelete = () => {
    const boardId = Number(params.boardId)
    if (Number.isNaN(boardId)) {
      toastManager.add({
        title: "Error",
        description: "Invalid board ID",
      })
      return
    }

    deleteCard({
      id: data.id,
      boardId,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-2 text-sm font-semibold text-foreground">
        <DotsThreeCircleIcon className="h-4 w-4" />
        Actions
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleCopy}
          disabled={isCopying}
          variant="ghost"
          className="h-9 w-full justify-start px-3 transition-colors hover:bg-muted"
          size="sm"
        >
          <CopyIcon className="mr-3 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{isCopying ? "Copying..." : "Copy"}</span>
        </Button>

        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="ghost"
          className="group h-9 w-full justify-start px-3 transition-colors hover:bg-destructive/10 hover:text-destructive"
          size="sm"
        >
          <TrashIcon className="mr-3 h-4 w-4 text-muted-foreground transition-colors group-hover:text-destructive" />
          <span className="text-sm">{isDeleting ? "Deleting..." : "Delete"}</span>
        </Button>
      </div>
    </div>
  )
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  )
}
