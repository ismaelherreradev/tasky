import type { BoardSelect } from "~/server/db/schema";

import { BoardOptions } from "./board-options";
import { BoardTitleForm } from "./board-title-form";

type BoardNavbarProps = {
  data: BoardSelect;
  orgId: string;
};

export async function BoardNavbar({ data, orgId }: BoardNavbarProps) {
  return (
    <div className=" flex h-14  rounded-2xl justify-between bg-muted  items-center gap-x-4  px-6">
      <BoardTitleForm data={data} />
      <div>
        <BoardOptions id={data.id} orgId={orgId} />
      </div>
    </div>
  );
}
