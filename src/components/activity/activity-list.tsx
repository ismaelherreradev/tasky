"use client";

import { useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

import ActivityItem from "./activity-item";

export default function ActivityList() {
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
    return (
      <p className="text-red-500">Error loading audit logs: {error.message}</p>
    );
  }

  return (
    <ol className="mt-4 space-y-4">
      {auditLogs?.length === 0 ? (
        <p className="text-center text-muted-foreground text-xs">
          No activity found inside this organization
        </p>
      ) : (
        auditLogs?.map((log) => <ActivityItem key={log.id} data={log} />)
      )}
    </ol>
  );
}

const SKELETON_IDS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
] as const;

export function ActivityListSkeleton() {
  return (
    <ol className="mt-4 space-y-4">
      {SKELETON_IDS.map((id) => (
        <Skeleton key={id} className="h-14 w-full" />
      ))}
    </ol>
  );
}
