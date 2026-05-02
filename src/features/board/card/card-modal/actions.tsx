import { CopyIcon, DotsThreeCircleIcon, TrashIcon } from "@phosphor-icons/react"
import { useParams } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"
import { toastManager } from "#/components/ui/toast"
import { useCopyCard } from "#/hooks/mutations/use-copy-card"
import { useDeleteCard } from "#/hooks/mutations/use-delete-card"
import { closeCardModal } from "#/hooks/use-card-modal"

import type { CardWithList } from "."

type ActionsProps = {
  data: CardWithList
}

export default function Actions({ data }: ActionsProps) {
  const params = useParams({ from: "/_auth/board/$boardId" })

  const boardId = Number(params.boardId)

  const { mutate: copyCard, isPending: isCopying } = useCopyCard({
    boardId,
    onSuccess: () => closeCardModal(),
  })

  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard({
    boardId,
    onSuccess: () => closeCardModal(),
  })

  const handleCopy = () => {
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
          variant="secondary"
          className="h-9 w-full justify-start px-3"
          size="sm"
        >
          <CopyIcon className="mr-3 h-4 w-4" />
          <span className="text-sm">{isCopying ? "Copying..." : "Copy"}</span>
        </Button>

        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="destructive"
          className="h-9 w-full justify-start px-3"
          size="sm"
        >
          <TrashIcon className="mr-3 h-4 w-4" />
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
