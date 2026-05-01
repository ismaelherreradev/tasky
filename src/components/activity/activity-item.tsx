import { Avatar, AvatarImage } from "#/components/ui/avatar"
import type { AuditLogsSelect } from "#/db/schema"
import { formatDateToLocal, generateLogMessage } from "#/lib/utils"

type ActivityItemProps = {
  data: AuditLogsSelect
}

export default function ActivityItem({ data }: ActivityItemProps) {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={data.userImage} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-neutral-700 lowercase">{data.userName}</span>{" "}
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDateToLocal(data.createdAt.toString())}
        </p>
      </div>
    </li>
  )
}
