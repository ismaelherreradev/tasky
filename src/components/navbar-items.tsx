import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  UserButton,
} from "@clerk/tanstack-react-start"
import { GearIcon, ActivityIcon, LayoutIcon } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { useMemo } from "react"

import { Button } from "#/components/ui/button"
import { ScrollArea } from "#/components/ui/scroll-area"
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Skeleton } from "#/components/ui/skeleton"
import { useTRPC } from "#/integrations/trpc/react"
import type { BoardSelect } from "#/server/db/schema"

type ItemProps = {
  orgId: string
}

export function SelectBoardButton({ orgId }: ItemProps) {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { data: boards, isPending } = useQuery(trpc.board.getBoards.queryOptions({ orgId }))

  const memoizedBoards = useMemo(() => boards, [boards])

  const items = useMemo(
    () =>
      memoizedBoards?.map((board) => ({
        label: board.title,
        value: String(board.id),
      })) ?? [],
    [memoizedBoards],
  )

  const handleValueChange = (value: string | null) => {
    if (value) {
      navigate({ to: "/board/$boardId", params: { boardId: value } })
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Select items={items} onValueChange={handleValueChange} value="">
        <SelectTrigger className="h-8 gap-2 px-3 font-medium transition-all hover:scale-105">
          <LayoutIcon size={16} />
          <SelectValue placeholder="Boards" />
        </SelectTrigger>
        <SelectPopup className="w-64" align="start">
          <SelectLabel className="font-semibold">Your Boards</SelectLabel>
          <SelectSeparator />
          {isPending ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ) : items.length > 0 ? (
            <ScrollArea className="max-h-64">
              <div className="p-1">
                {memoizedBoards?.map((board) => (
                  <SelectItem key={board.id} value={String(board.id)}>
                    <div className="flex w-full items-center gap-2">
                      <LayoutIcon size={14} className="text-muted-foreground" />
                      <span>{board.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No boards found</div>
          )}
        </SelectPopup>
      </Select>
    </div>
  )
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
  )
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
  )
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
  )
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
  )
}
