import { ArrowLeft, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import type { BoardSelect } from "~/server/db/schema";

import { BoardOptions } from "./board-options";
import { BoardStats } from "./board-stats";
import { BoardTitleForm } from "./board-title-form";

type BoardNavbarProps = {
  data: BoardSelect;
  orgId: string;
};

export async function BoardNavbar({ data, orgId }: BoardNavbarProps) {
  return (
    <nav
      className="sticky top-0 z-40 w-full overflow-hidden border-border/40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Board navigation"
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="shrink-0 gap-1 text-muted-foreground hover:text-foreground sm:gap-2"
          >
            <Link href={`/organization/${orgId}`}>
              <ArrowLeft size={16} />
              <span className="hidden lg:inline">Back to Boards</span>
            </Link>
          </Button>

          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
            <Link
              href={`/organization/${orgId}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Boards
            </Link>
            <span className="shrink-0 text-muted-foreground">/</span>
            <span className="max-w-[150px] truncate font-medium">
              {data.title}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center px-2">
          <div className="flex w-full max-w-sm items-center gap-2">
            <div className="hidden shrink-0 items-center gap-2 text-muted-foreground xl:flex">
              <Users size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <BoardTitleForm data={data} />
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="hidden xl:block">
            <BoardStats boardId={data.id} variant="compact" />
          </div>

          <div className="hidden items-center gap-2 text-muted-foreground text-sm 2xl:flex">
            <Calendar size={14} />
            <span className="whitespace-nowrap">
              {data.createdAt ? data.createdAt.toLocaleDateString() : "Unknown"}
            </span>
          </div>

          <Separator orientation="vertical" className="hidden h-6 xl:block" />

          <BoardOptions id={data.id} orgId={orgId} />
        </div>
      </div>
    </nav>
  );
}
