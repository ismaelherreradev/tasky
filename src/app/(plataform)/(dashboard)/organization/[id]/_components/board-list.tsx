"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { PlusIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

import { FormPopover } from "./create-board";

export function BoardList({ orgId }: { orgId: string }) {
  const [boards] = api.board.getBoards.useSuspenseQuery({ orgId });

  return (
    <div>
      <div className="flex w-full justify-end">
        <FormPopover orgId={orgId} sideOffset={10} side="right">
          <Button>
            <PlusIcon size={18} /> Create new board
          </Button>
        </FormPopover>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group relative flex aspect-video h-full w-full flex-col items-center overflow-hidden rounded-md bg-muted bg-cover bg-center bg-no-repeat p-2"
          >
            <p className="relative p-2 font-semibold text-white">{board.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
