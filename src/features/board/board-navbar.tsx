import { ArrowLeft } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"

import { Button } from "#/components/ui/button"
import { Separator } from "#/components/ui/separator"
import { useTRPC } from "#/integrations/trpc/react"

import { BoardOptions } from "./board-options"
import { BoardStats } from "./board-stats"

type BoardNavbarProps = {
  boardId: number
  orgId: string
}

export function BoardNavbar({ boardId, orgId }: BoardNavbarProps) {
  const trpc = useTRPC()
  const { data: board } = useQuery(trpc.board.getBoardById.queryOptions({ boardId, orgId }))
  return (
    <nav
      className="flex h-14 w-full shrink-0 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60"
      aria-label="Board navigation"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          render={
            <Link to="/organization/$orgId" params={{ orgId }} title="Back to Boards">
              <ArrowLeft size={18} />
              <span className="sr-only">Back to Boards</span>
            </Link>
          }
        />

        <Separator orientation="vertical" className="h-4" />

        <div className="flex min-w-0 items-center pl-1">
          <span className="text-lg font-bold">{board?.title ?? "Loading..."}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden md:block">
          <BoardStats boardId={boardId} variant="compact" />
        </div>

        <BoardOptions boardId={boardId} orgId={orgId} board={board ?? undefined} />
      </div>
    </nav>
  )
}
