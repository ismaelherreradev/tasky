import type { ListSelect } from "#/server/db/schema"

import ListOptions from "./list-options"

type ListHeaderProps = {
  data: ListSelect
  boardId: number
}

export default function ListHeader({ data, boardId }: ListHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
      {data.color && (
        <span
          className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: data.color }}
          aria-hidden="true"
        />
      )}
      <span className="h-7 w-full px-2.5 py-1 text-left text-sm font-medium">{data.title}</span>
      <ListOptions data={data} boardId={boardId} />
    </div>
  )
}
