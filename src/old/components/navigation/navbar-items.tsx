"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";
import {
  ActivityIcon,
  ChevronDown,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { useBoardPath, useOrganizationPath } from "~/hooks/use-path-matcher";
import type { BoardSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";

type ItemProps = {
  orgId: string;
};

function BoardDropdownItem({ board }: { board: BoardSelect }) {
  const { path, isMatchingPath } = useBoardPath("Board", board.id.toString());

  return (
    <DropdownMenuItem asChild>
      <Link href={path} className="w-full cursor-pointer">
        <div className="flex w-full items-center gap-2">
          <LayoutDashboardIcon size={14} className="text-muted-foreground" />
          <span
            className={`flex-1 truncate ${isMatchingPath ? "font-semibold text-primary" : ""}`}
          >
            {board.title}
          </span>
        </div>
      </Link>
    </DropdownMenuItem>
  );
}

export function SelectBoardButton({ orgId }: ItemProps) {
  const { data: boards, isPending } = api.board.getBoards.useQuery({ orgId });
  const memoizedBoards = useMemo(
    () => boards as BoardSelect[] | undefined,
    [boards],
  );
  const pathname = usePathname();
  const isActive = pathname.includes("board");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isActive ? "default" : "ghost"}
          size="sm"
          className="h-8 gap-2 px-3 font-medium transition-all hover:scale-105"
        >
          <LayoutDashboardIcon size={16} />
          <span className="hidden sm:inline">Boards</span>
          <ChevronDown size={14} className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="font-semibold">
          Your Boards
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isPending ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ) : memoizedBoards && memoizedBoards.length > 0 ? (
            <ScrollArea className="max-h-64">
              <div className="p-1">
                {memoizedBoards.map((board) => (
                  <BoardDropdownItem key={board.id} board={board} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No boards found
            </div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/organization/${orgId}`}
            className="w-full cursor-pointer font-medium text-primary"
          >
            <LayoutDashboardIcon size={14} className="mr-2" />
            View all boards
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SettingsButton({ orgId }: ItemProps) {
  const { path, isMatchingPath } = useOrganizationPath("Settings", orgId);

  return (
    <Button
      variant={isMatchingPath ? "default" : "ghost"}
      size="sm"
      className="h-8 gap-2 px-3 font-medium transition-all hover:scale-105"
      asChild
    >
      <Link href={path}>
        <SettingsIcon size={16} />
        <span className="hidden sm:inline">Settings</span>
      </Link>
    </Button>
  );
}

export function ActivityButton({ orgId }: ItemProps) {
  const { path, isMatchingPath } = useOrganizationPath("Activity", orgId);

  return (
    <Button
      variant={isMatchingPath ? "default" : "ghost"}
      size="sm"
      className="h-8 gap-2 px-3 font-medium transition-all hover:scale-105"
      asChild
    >
      <Link href={path}>
        <ActivityIcon size={16} />
        <span className="hidden sm:inline">Activity</span>
      </Link>
    </Button>
  );
}

export function OrganizationSwitcherButton() {
  return (
    <div className="flex items-center">
      <ClerkLoading>
        <Skeleton className="h-8 w-24 rounded-md" />
      </ClerkLoading>
      <ClerkLoaded>
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
        />
      </ClerkLoaded>
    </div>
  );
}

export function UserClerkButton() {
  return (
    <div className="flex items-center">
      <ClerkLoading>
        <Skeleton className="h-8 w-8 rounded-full" />
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton />
      </ClerkLoaded>
    </div>
  );
}
