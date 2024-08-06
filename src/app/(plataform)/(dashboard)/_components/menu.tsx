"use client";

import { Ellipsis, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useClerk } from "@clerk/nextjs";

import { Paths } from "~/config/site";

import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getMenuList, type Menu as MenuItem } from "~/lib/menu-list";
import { cn } from "~/lib/utils";
import { CollapseMenuButton } from "./collapse-menu-button";

type MenuProps = {
  isOpen: boolean | undefined;
};

type GroupedMenuItem = {
  groupLabel?: string;
  menus: MenuItem[];
};

type GroupLabelProps = {
  groupLabel: string;
  isOpen: boolean | undefined;
};

type MenuItemComponentProps = {
  item: MenuItem;
  isOpen: boolean | undefined;
};

type SignOutButtonProps = {
  isOpen: boolean | undefined;
};

function GroupLabel({ groupLabel, isOpen }: GroupLabelProps) {
  if (isOpen || isOpen === undefined) {
    return (
      <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
        {groupLabel}
      </p>
    );
  }
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger className="w-full">
          <div className="flex w-full items-center justify-center">
            <Ellipsis className="h-5 w-5" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{groupLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MenuItemComponent({ item, isOpen }: MenuItemComponentProps) {
  const { href, label, icon: Icon, active, submenus } = item;

  if (submenus?.length === 0) {
    return (
      <div className="w-full">
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant={active ? "secondary" : "ghost"}
                className="mb-1 h-10 w-full justify-start"
                asChild
              >
                <Link href={href}>
                  <span className={cn(isOpen === false ? "" : "mr-4")}>
                    <Icon size={18} />
                  </span>
                  <p
                    className={cn(
                      "max-w-[200px] truncate",
                      isOpen === false
                        ? "-translate-x-96 opacity-0"
                        : "translate-x-0 opacity-100",
                    )}
                  >
                    {label}
                  </p>
                </Link>
              </Button>
            </TooltipTrigger>
            {isOpen === false && (
              <TooltipContent side="right">{label}</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  return (
    <div className="w-full">
      <CollapseMenuButton
        icon={Icon}
        label={label}
        active={active}
        submenus={submenus!}
        isOpen={isOpen}
      />
    </div>
  );
}

function SignOutButton({ isOpen }: SignOutButtonProps) {
  const { signOut } = useClerk();
  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="mt-5 h-10 w-full justify-center"
            onClick={() => signOut({ redirectUrl: Paths.LandingPage })}
          >
            <span className={cn(isOpen === false ? "" : "mr-4")}>
              <LogOut size={18} />
            </span>
            <p
              className={cn(
                "whitespace-nowrap",
                isOpen === false ? "hidden opacity-0" : "opacity-100",
              )}
            >
              Sign out
            </p>
          </Button>
        </TooltipTrigger>
        {isOpen === false && (
          <TooltipContent side="right">Sign out</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList: GroupedMenuItem[] = getMenuList(pathname);

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {groupLabel && (
                <GroupLabel groupLabel={groupLabel} isOpen={isOpen} />
              )}
              {menus.map((menu, idx) => (
                <MenuItemComponent key={idx} item={menu} isOpen={isOpen} />
              ))}
            </li>
          ))}
          <li className="flex w-full grow items-end">
            <SignOutButton isOpen={isOpen} />
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
