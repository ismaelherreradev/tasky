import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "#/components/ui/pagination"
import { Skeleton } from "#/components/ui/skeleton"
import { useTRPC } from "#/integrations/trpc/react"
import { cn } from "#/lib/utils"

import ActivityItem from "./activity-item"

export default function ActivityList() {
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const [page, setPage] = useState(1)
  const limit = 10

  const trpc = useTRPC()

  const queryClient = useQueryClient()

  const { data, isLoading, isPlaceholderData, isFetching, error } = useQuery({
    ...trpc.logs.getAllAuditLogs.queryOptions({ page, limit }),
    placeholderData: keepPreviousData,
    retry:
      retryCount < maxRetries
        ? () => {
            setRetryCount(retryCount + 1)
            return true
          }
        : false,
  })

  useEffect(() => {
    if (data?.totalCount && page < Math.ceil(data.totalCount / limit)) {
      void queryClient.prefetchQuery(
        trpc.logs.getAllAuditLogs.queryOptions({ page: page + 1, limit }),
      )
    }
  }, [data?.totalCount, page, limit, queryClient, trpc.logs.getAllAuditLogs])

  const auditLogs = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / limit)

  if (isLoading) {
    return <ActivityListSkeleton />
  }

  if (error) {
    return <p className="text-red-500">Error loading audit logs: {error.message}</p>
  }

  return (
    <div className="space-y-4">
      <ol
        className={cn(
          "space-y-1 transition-opacity",
          (isFetching || isPlaceholderData) && "opacity-50",
        )}
      >
        {auditLogs.length === 0 ? (
          <li className="py-8 text-center text-sm text-muted-foreground">
            No activity found inside this organization
          </li>
        ) : (
          auditLogs.map((log) => <ActivityItem key={log.id} data={log} />)
        )}
      </ol>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) setPage((p) => p - 1)
                }}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="flex items-center px-4 text-sm font-medium">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages) setPage((p) => p + 1)
                }}
                aria-disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
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
