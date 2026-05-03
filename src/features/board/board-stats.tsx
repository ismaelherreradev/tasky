import { ActivityIcon, FileTextIcon, LayoutIcon } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"

import { useTRPC } from "#/integrations/trpc/react"
import { cn } from "#/lib/utils"

type BoardStatsProps = {
  boardId: number
  className?: string
  variant?: "compact" | "detailed"
}

export function BoardStats({ boardId, className, variant = "compact" }: BoardStatsProps) {
  const trpc = useTRPC()
  const { data: lists, isLoading } = useQuery(trpc.list.getlistsWithCards.queryOptions({ boardId }))

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="h-3 w-3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-8 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="h-3 w-3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-8 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!lists) return null

  const listCount = lists.length
  const cardCount = lists.reduce((total, list) => total + list.cards.length, 0)

  if (variant === "detailed") {
    return (
      <div className={cn("flex items-center gap-6 text-sm text-muted-foreground", className)}>
        <div className="flex items-center gap-2">
          <LayoutIcon size={14} />
          <span>
            {listCount} {listCount === 1 ? "list" : "lists"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileTextIcon size={14} />
          <span>
            {cardCount} {cardCount === 1 ? "card" : "cards"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ActivityIcon size={14} />
          <span>Active</span>
        </div>
      </div>
    )
  }
  return (
    <div className={cn("flex items-center gap-4 text-xs text-muted-foreground", className)}>
      <div className="flex items-center gap-1">
        <LayoutIcon size={12} />
        <span>{listCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <FileTextIcon size={12} />
        <span>{cardCount}</span>
      </div>
    </div>
  )
}
