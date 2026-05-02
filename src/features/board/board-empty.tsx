import { KanbanIcon } from "@phosphor-icons/react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { CreateBoardDialog } from "./create-board"

export function BoardEmpty({ orgId }: { orgId: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <KanbanIcon />
        </EmptyMedia>
        <EmptyTitle>No boards yet</EmptyTitle>
        <EmptyDescription>
          Create your first board to start organizing your tasks and projects.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <CreateBoardDialog orgId={orgId} />
      </EmptyContent>
    </Empty>
  )
}
