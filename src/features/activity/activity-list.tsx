import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { Skeleton } from "#/components/ui/skeleton"
import { useTRPC } from "#/integrations/trpc/react"

import ActivityItem from "./activity-item"

export default function ActivityList() {
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const trpc = useTRPC()

  const {
    data: auditLogs,
    isLoading,
    error,
  } = useQuery({
    ...trpc.logs.getAllAuditLogs.queryOptions(),
    retry:
      retryCount < maxRetries
        ? () => {
            setRetryCount(retryCount + 1)
            return true
          }
        : false,
  })

  if (isLoading) {
    return <ActivityListSkeleton />
  }

  if (error) {
    return <p className="text-red-500">Error loading audit logs: {error.message}</p>
  }

  return (
    <ol className="space-y-1">
      {auditLogs?.length === 0 ? (
        <li className="py-8 text-center text-sm text-muted-foreground">
          No activity found inside this organization
        </li>
      ) : (
        auditLogs?.map((log) => <ActivityItem key={log.id} data={log} />)
      )}
    </ol>
  )
}

const SKELETON_IDS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4", "skeleton-5"] as const

export function ActivityListSkeleton() {
  return (
    <div className="space-y-3">
      {SKELETON_IDS.map((id) => (
        <div key={id} className="flex items-center gap-3 py-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
