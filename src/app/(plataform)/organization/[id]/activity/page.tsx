import { Suspense } from "react";

import { ActivityList, ActivityListSkeleton } from "./_components/activity-list";

export default function ActivityPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<ActivityListSkeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
