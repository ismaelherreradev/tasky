import Link from "next/link";
import { ThemeToggle } from "~/components/theme-toggle";
import { SiteConfig } from "~/config/site";

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
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href={`/organization/${orgId}`}
            className="group flex items-center space-x-2 transition-all hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary/80 font-bold text-primary-foreground text-sm transition-transform group-hover:scale-105">
              T
            </div>
            <span className="hidden bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-transparent text-xl tracking-tight sm:block">
              {SiteConfig.title}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 md:flex">
            <SelectBoardButton orgId={orgId} />
            <ActivityButton orgId={orgId} />
            <SettingsButton orgId={orgId} />
          </nav>

          <div className="ml-4 flex items-center gap-3 border-border/40 border-l pl-4">
            <div className="md:hidden">
              <SelectBoardButton orgId={orgId} />
            </div>
            <OrganizationSwitcherButton />
            <ThemeToggle />
            <UserClerkButton />
          </div>
        </div>
      </div>
    </header>
  );
}
