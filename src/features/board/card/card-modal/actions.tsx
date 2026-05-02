import { CopyIcon, DotsThreeCircleIcon, TrashIcon } from "@phosphor-icons/react"
import { useParams } from "@tanstack/react-router"
import { useAtom } from "jotai"

import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"
import { toastManager } from "#/components/ui/toast"
import { onCloseAtom } from "#/hooks/use-card-modal"
import { useCopyCard } from "#/hooks/mutations/use-copy-card"
import { useDeleteCard } from "#/hooks/mutations/use-delete-card"

import type { CardWithList } from "."

type ActionsProps = {
  data: CardWithList
}

export default function Actions({ data }: ActionsProps) {
  const params = useParams({ from: "/board/$boardId" })
  const [, onClose] = useAtom(onCloseAtom)

  const boardId = Number(params.boardId)

  const { mutate: copyCard, isPending: isCopying } = useCopyCard({
    boardId,
    onSuccess: () => onClose(),
  })

  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard({
    boardId,
    onSuccess: () => onClose(),
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
