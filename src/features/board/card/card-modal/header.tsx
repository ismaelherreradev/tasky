import { CreditCardIcon } from "@phosphor-icons/react"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { type ComponentRef, useRef, useState } from "react"

import { Badge } from "#/components/ui/badge"
import { Input } from "#/components/ui/input"
import { Skeleton } from "#/components/ui/skeleton"
import { useUpdateCard } from "#/hooks/mutations/use-update-card"
import { useTRPC } from "#/integrations/trpc/react"

import type { CardWithList } from "."

type HeaderProps = {
  data: CardWithList
}

export default function Header({ data }: HeaderProps) {
  const params = useParams({ from: "/_auth/board/$boardId" })
  const [title, setTitle] = useState(data?.title)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const updateCard = useUpdateCard({
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({
        queryKey: trpc.list.getlistsWithCards.queryKey({ boardId: Number(params.boardId) }),
      })
      setTitle(updated.title ?? "")
    },
  })

  const inputRef = useRef<ComponentRef<"input">>(null)

  function onBlur() {
    inputRef.current?.form?.requestSubmit()
  }

  function onSubmit(formData: FormData) {
    const title = formData.get("title") as string

    if (title === data.title) {
      return
    }

    updateCard.mutate({
      title,
      id: data.id,
    })
  }

  return (
    <div className="flex w-full items-start gap-x-3 pr-8">
      <div className="mt-0.5 shrink-0 text-muted-foreground">
        <CreditCardIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <form action={onSubmit}>
          <Input
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            name="title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-7 resize-none border-none bg-transparent px-0 text-xl font-bold text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Card title"
          />
        </form>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <span>in list</span>
          <span className="font-medium underline decoration-muted-foreground/30 underline-offset-4">
            {data.list.title}
          </span>
        </div>
      </div>
    </div>
  )
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 pr-8">
      <div className="mt-0.5 shrink-0 text-muted-foreground">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-7 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>
    </div>
  )
}
