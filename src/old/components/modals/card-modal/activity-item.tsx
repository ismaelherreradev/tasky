import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import { formatDateToLocal, generateLogMessage } from "~/lib/utils";
import type { AuditLogsSelect } from "~/server/db/schema";

type ActivityItemProps = {
  data: AuditLogsSelect;
};

export function ActivityItem({ data }: ActivityItemProps) {
  const initials = data.userName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-colors hover:bg-card/80">
      <Avatar className="h-8 w-8 shrink-0 border border-border/50">
        <AvatarImage src={data.userImage} alt={data.userName} />
        <AvatarFallback className="bg-primary/10 font-medium text-primary text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-foreground text-sm">
          <span className="font-medium text-primary">{data.userName}</span>
          <span className="ml-1 text-muted-foreground">
            {generateLogMessage(data)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <time dateTime={data.createdAt.toString()}>
            {formatDateToLocal(data.createdAt.toString())}
          </time>
        </div>
      </div>
    </div>
  );
}
