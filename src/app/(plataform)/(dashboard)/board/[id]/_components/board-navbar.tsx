import type { BoardSelect } from "~/server/db/schema";

import { BoardOptions } from "./board-options";
import { BoardTitleForm } from "./board-title-form";

type BoardNavbarProps = {
  data: BoardSelect;
};

export async function BoardNavbar({ data }: BoardNavbarProps) {
  return (
    <div className="fixed top-14 z-[40] flex h-14  items-center gap-x-4 bg-black/50 px-6">
      <BoardTitleForm data={data} />
      <div className="ml-auto">
        <BoardOptions id={data.id} orgId={Number(data.orgId)} />
      </div>
    </div>
  );
}
