"use client";

import { Activity, FileText, LayoutList } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type BoardStatsProps = {
  boardId: number;
  className?: string;
  variant?: "compact" | "detailed";
};

export function BoardStats({
  boardId,
  className,
  variant = "compact",
}: BoardStatsProps) {
  const { data: lists, isLoading } = api.list.getlistsWithCards.useQuery({
    boardId,
  });

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <div className="h-3 w-3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-8 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <div className="h-3 w-3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-8 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!lists) return null;

  const listCount = lists.length;
  const cardCount = lists.reduce((total, list) => total + list.cards.length, 0);

  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "flex items-center gap-6 text-muted-foreground text-sm",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <LayoutList size={14} />
          <span>
            {listCount} {listCount === 1 ? "list" : "lists"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={14} />
          <span>
            {cardCount} {cardCount === 1 ? "card" : "cards"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={14} />
          <span>Active</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 text-muted-foreground text-xs",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <LayoutList size={12} />
        <span>{listCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <FileText size={12} />
        <span>{cardCount}</span>
      </div>
    </div>
  );
}
