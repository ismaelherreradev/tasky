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
    <div className="border-border/50 bg-card/50 hover:bg-card/80 flex items-start gap-3 rounded-lg border p-3 transition-colors">
      <Avatar className="border-border/50 h-8 w-8 shrink-0 border">
        <AvatarImage src={data.userImage} alt={data.userName} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-foreground text-sm">
          <span className="text-primary font-medium">{data.userName}</span>
          <span className="text-muted-foreground ml-1">
            {generateLogMessage(data)}
          </span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <time dateTime={data.createdAt.toString()}>
            {formatDateToLocal(data.createdAt.toString())}
          </time>
        </div>
      </div>
    </div>
  );
}
