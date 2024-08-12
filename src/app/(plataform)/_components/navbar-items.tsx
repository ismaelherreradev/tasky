"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClerkLoaded, ClerkLoading, OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { type BoardSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { ActivityIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";

import { useClerkAppearance } from "~/hooks/use-clerk-appearance";
import { useBoardPath, useOrganizationPath } from "~/hooks/use-path-matcher";
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

type ItemProps = {
  orgId: string;
};

function BoardDropdownItem({ board }: { board: BoardSelect }) {
  const { path, isMatchingPath } = useBoardPath("Board", board.id.toString());

  return (
    <DropdownMenuItem asChild>
      <Link href={path}>
        <span className={isMatchingPath ? "font-bold " : ""}>{board.title}</span>
      </Link>
    </DropdownMenuItem>
  );
}

export function SelectBoardButton({ orgId }: ItemProps) {
  const { data: boards, isPending } = api.board.getBoards.useQuery({ orgId });
  const memoizedBoards = useMemo(() => boards, [boards]);
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Boards" variant={pathname.includes("board") ? "secondary" : "ghost"}>
          <LayoutDashboardIcon size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Boards</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ScrollArea className="h-40">
            {isPending ? (
              <Skeleton className="w-full" />
            ) : (
              memoizedBoards?.map((board) => <BoardDropdownItem key={board.id} board={board} />)
            )}
          </ScrollArea>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SettingsButton({ orgId }: ItemProps) {
  const { path, isMatchingPath } = useOrganizationPath("Settings", orgId);

  return (
    <Button
      size={"icon"}
      aria-label="Settings"
      variant={isMatchingPath ? "secondary" : "ghost"}
      asChild
    >
      <Link href={path}>
        <SettingsIcon size={20} />
      </Link>
    </Button>
  );
}

export function ActivityButton({ orgId }: ItemProps) {
  const { path, isMatchingPath } = useOrganizationPath("Activity", orgId);

  return (
    <Button
      size={"icon"}
      aria-label="Activity"
      variant={isMatchingPath ? "secondary" : "ghost"}
      asChild
    >
      <Link href={path}>
        <ActivityIcon size={20} />
      </Link>
    </Button>
  );
}

export function OrganizationSwitcherButton() {
  const appearance = useClerkAppearance();

  return (
    <>
      <ClerkLoading>
        <Skeleton className="flex h-7 w-[117.77px]" />
      </ClerkLoading>
      <ClerkLoaded>
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={appearance}
        />
      </ClerkLoaded>
    </>
  );
}

export function UserClerkButton() {
  const appearance = useClerkAppearance();

  return (
    <>
      <ClerkLoading>
        <Skeleton className="w-8 h-8 rounded-full " />
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton appearance={appearance} />
      </ClerkLoaded>
    </>
  );
}
