import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

import ActivityList, { ActivityListSkeleton } from "#/features/activity/activity-list"

export const Route = createFileRoute("/_auth/organization_/$orgId/activity")({
  component: ActivityPage,
})

function ActivityPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Organization Activity
        </h1>
        <p className="text-sm text-muted-foreground">
          View recent events and changes across all your boards.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-xs">
        <div className="p-6">
          <Suspense fallback={<ActivityListSkeleton />}>
            <ActivityList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
