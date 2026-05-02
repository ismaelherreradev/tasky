import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import ActivityList, { ActivityListSkeleton } from "#/features/activity/activity-list"

export const Route = createFileRoute("/_auth/(organization)/organization_/$orgId/activity")({
  component: ActivityPage,
})

function ActivityPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<ActivityListSkeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  )
}
