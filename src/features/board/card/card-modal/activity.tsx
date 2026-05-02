import { ArrowsClockwiseIcon, ClockIcon } from "@phosphor-icons/react"

import { Empty, EmptyDescription, EmptyMedia } from "#/components/ui/empty"
import { Skeleton } from "#/components/ui/skeleton"
import type { AuditLogsSelect } from "#/server/db/schema"

import { ActivityItem } from "./activity-item"

type ActivityProps = {
  items: AuditLogsSelect[]
}

export default function Activity({ items }: ActivityProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-3 text-muted-foreground">
        <ArrowsClockwiseIcon className="h-5 w-5" />
        <h3 className="font-semibold text-foreground">Activity</h3>
      </div>

      <div className="ml-8">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <ActivityItem key={item.id} data={item} />
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyMedia variant="icon">
              <ClockIcon className="h-4 w-4" />
            </EmptyMedia>
            <EmptyDescription>No activity yet</EmptyDescription>
          </Empty>
        )}
      </div>
    </div>
  )
}

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-3 text-muted-foreground">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="ml-8 space-y-3">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}
