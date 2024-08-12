import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { SiteConfig } from "~/config/site";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";

import { CreateBoardPopover } from "./create-board";
import {
  ActivityButton,
  OrganizationSwitcherButton,
  SelectBoardButton,
  SettingsButton,
  UserClerkButton,
} from "./navbar-items";

type NavbarProps = {
  orgId: string;
};

export async function Navbar({ orgId }: NavbarProps) {
  return (
    <header className="py-10">
      <div className="flex-col md:flex-row items-center justify-between">
        <Link
          href={`/organization/${orgId}`}
          className="scroll-m-20 inline-block mb-5 text-2xl font-semibold tracking-tight lg:text-2xl"
        >
          {SiteConfig.title}
        </Link>
        <nav className="flex flex-col md:flex-row lg:flex-row justify-center md:justify-end items-center space-x-4 md:space-x-10 lg:space-x-20">
          <div className=" md:flex items-center justify-center space-x-2">
            <SelectBoardButton orgId={orgId} />
            <ActivityButton orgId={orgId} />
            <SettingsButton orgId={orgId} />
            <OrganizationSwitcherButton />
          </div>
          <div className="flex items-center space-x-4">
            <CreateBoardPopover sideOffset={5} orgId={orgId}>
              <Button
                aria-label="Add Board"
                size={"icon"}
                className="w-8 h-8 flex items-center justify-center rounded-full"
              >
                <PlusIcon size={20} />
              </Button>
            </CreateBoardPopover>
            <UserClerkButton />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
