import { memo } from "react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { Ellipsis, Link } from "lucide-react";

import { cn } from "~/lib/utils";
import type { Group, Menu } from "~/hooks/use-menu-list";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

import { CollapseMenuButton } from "./collapse-menu-button";

export const MenuItem = memo(({ menu, isOpen }: { menu: Menu; isOpen: boolean | undefined }) => {
  return (
    <div className="w-full">
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant={menu.active ? "secondary" : "ghost"}
              className="mb-1 h-10 w-full justify-start"
              asChild
            >
              <Link href={menu.href}>
                <span className={cn(isOpen === false ? "" : "mr-4")}>
                  <menu.icon size={18} />
                </span>
                <p
                  className={cn(
                    "max-w-[200px] truncate",
                    isOpen === false ? "-translate-x-96 opacity-0" : "translate-x-0 opacity-100",
                  )}
                >
                  {menu.label}
                </p>
              </Link>
            </Button>
          </TooltipTrigger>
          {isOpen === false && <TooltipContent side="right">{menu.label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
MenuItem.displayName = "MenuItem";

export const MenuGroup = memo(
  ({ group, isOpen }: { group: Group; isOpen: boolean | undefined }) => {
    return (
      <li className={cn("w-full", group.groupLabel ? "pt-5" : "")}>
        {(isOpen && group.groupLabel) || isOpen === undefined ? (
          <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
            {group.groupLabel}
          </p>
        ) : !isOpen && isOpen !== undefined && group.groupLabel ? (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger className="w-full">
                <div className="flex w-full items-center justify-center">
                  <Ellipsis className="h-5 w-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{group.groupLabel}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <p className="pb-2"></p>
        )}
        {group.menus.map((menu, index) =>
          menu.submenus?.length === 0 ? (
            <MenuItem key={index} menu={menu} isOpen={isOpen} />
          ) : (
            <div className="w-full" key={index}>
              <CollapseMenuButton
                icon={menu.icon}
                label={menu.label}
                active={menu.active}
                submenus={menu.submenus!}
                isOpen={isOpen}
              />
            </div>
          ),
        )}
      </li>
    );
  },
);
MenuGroup.displayName = "MenuGroup";
