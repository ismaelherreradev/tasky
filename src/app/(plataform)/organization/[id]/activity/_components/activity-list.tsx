"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

import { Skeleton } from "~/components/ui/skeleton";

import { ActivityItem } from "./activity-item";

export function ActivityList() {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const {
    data: auditLogs,
    isLoading,
    error,
  } = api.logs.getAllAuditLogs.useQuery(undefined, {
    retry:
      retryCount < maxRetries
        ? () => {
            setRetryCount(retryCount + 1);
            return true;
          }
        : false,
  });

  if (isLoading) {
    return <ActivityListSkeleton />;
  }

  if (error) {
    return <p className="text-red-500">Error loading audit logs: {error.message}</p>;
  }

  return (
    <ol className="mt-4 space-y-4">
      {auditLogs?.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground">
          No activity found inside this organization
        </p>
      ) : (
        auditLogs?.map((log) => <ActivityItem key={log.id} data={log} />)
      )}
    </ol>
  );
}

export function ActivityListSkeleton() {
  return (
    <ol className="mt-4 space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </ol>
  );
}
