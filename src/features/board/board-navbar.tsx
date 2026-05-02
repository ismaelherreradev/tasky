import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, Calendar, Users } from "lucide-react"

import { Button } from "#/components/ui/button"
import { Separator } from "#/components/ui/separator"
import { useTRPC } from "#/integrations/trpc/react"

import { BoardOptions } from "./board-options"
import { BoardStats } from "./board-stats"
import { BoardTitleForm } from "./board-title-form"

type BoardNavbarProps = {
  boardId: number
  orgId: string
}

export function BoardNavbar({ boardId, orgId }: BoardNavbarProps) {
  const trpc = useTRPC()
  const { data: board } = useQuery(trpc.board.getBoardById.queryOptions({ boardId, orgId }))
  return (
    <nav
      className="sticky top-0 z-40 w-full overflow-hidden border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      aria-label="Board navigation"
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link to="/organization/$orgId" params={{ orgId }}>
                <ArrowLeft size={16} />
                <span className="hidden lg:inline">Back to Boards</span>
              </Link>
            }
          />

          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
            <Link
              to="/organization/$orgId"
              params={{ orgId }}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Boards
            </Link>
            <span className="shrink-0 text-muted-foreground">/</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center px-2">
          <div className="flex w-full max-w-sm items-center gap-2">
            <div className="hidden shrink-0 items-center gap-2 text-muted-foreground xl:flex">
              <Users size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <BoardTitleForm orgId={orgId} boardId={boardId} board={board ?? undefined} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden xl:block">
            <BoardStats boardId={boardId} variant="compact" />
          </div>

          <div className="hidden items-center gap-2 text-sm text-muted-foreground 2xl:flex">
            <Calendar size={14} />
          </div>

          <Separator orientation="vertical" className="hidden h-6 xl:block" />

          <BoardOptions boardId={boardId} orgId={orgId} board={board ?? undefined} />
        </div>
      </div>
    </nav>
  )
}
