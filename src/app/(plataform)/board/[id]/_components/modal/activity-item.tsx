import type { AuditLogsSelect } from "~/server/db/schema";

import { formatDateToLocal, generateLogMessage } from "~/lib/utils";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

type ActivityItemProps = {
  data: AuditLogsSelect;
};

export function ActivityItem({ data }: ActivityItemProps) {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={data.userImage} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-700">{data.userName}</span>{" "}
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDateToLocal(data.createdAt.toString())}
        </p>
      </div>
    </li>
  );
}
