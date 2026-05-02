import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  UserButton,
} from "@clerk/tanstack-react-start";
import { TagChevronIcon, GearIcon, ActivityIcon, LayoutIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";

import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { ScrollArea } from "#/components/ui/scroll-area";
import { Skeleton } from "#/components/ui/skeleton";
import type { BoardSelect } from "#/server/db/schema";
import { useTRPC } from "#/integrations/trpc/react";

type ItemProps = {
  orgId: string;
};

function BoardDropdownItem({ board }: { board: BoardSelect }) {
  return (
    <DropdownMenuItem asChild>
      <Link
        to="/board/$boardId"
        params={{ boardId: String(board.id) }}
        className="w-full cursor-pointer"
      >
        <div className="flex w-full items-center gap-2">
          <LayoutIcon size={14} className="text-muted-foreground" />
          <span>{board.title}</span>
        </div>
      </Link>
    </DropdownMenuItem>
  );
}

export function SelectBoardButton({ orgId }: ItemProps) {
  const trpc = useTRPC();

  const { data: boards, isPending } = useQuery({
    ...trpc.board.getBoards.queryOptions({ orgId }),
  });

  const memoizedBoards = useMemo(() => boards as BoardSelect[] | undefined, [boards]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="h-8 gap-2 px-3 font-medium transition-all hover:scale-105"
        >
          <LayoutIcon size={16} />
          <span className="hidden sm:inline">Boards</span>
          <TagChevronIcon size={14} className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="font-semibold">Your Boards</DropdownMenuLabel>
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
            <div className="p-4 text-center text-sm text-muted-foreground">No boards found</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to="/organization/$orgId"
            params={{ orgId }}
            className="w-full cursor-pointer font-medium text-primary"
          >
            <LayoutIcon size={14} className="mr-2" />
            View all boards
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SettingsButton({ orgId }: ItemProps) {
  return (
    <Button
      size="sm"
      variant="link"
      render={
        <Link to="/organization/$orgId/settings" params={{ orgId }}>
          <GearIcon size={16} />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      }
    />
  );
}

export function ActivityButton({ orgId }: ItemProps) {
  return (
    <Button
      variant="link"
      size="sm"
      className="h-8 gap-2 px-3 font-medium transition-all hover:scale-105"
      render={
        <Link to="/organization/$orgId/activity" params={{ orgId }}>
          <ActivityIcon size={16} />
          <span className="hidden sm:inline">Activity</span>
        </Link>
      }
    />
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
