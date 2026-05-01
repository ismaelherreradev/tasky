import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import { ActivityList, ActivityListSkeleton } from "#/components/activity"

export const Route = createFileRoute("/_protected/organization_/$orgId/activity")({
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
