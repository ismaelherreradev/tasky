import { CheckSquareIcon } from "@phosphor-icons/react"
import { Link } from "@tanstack/react-router"

import ThemeToggle from "#/components/theme-toggle"
import siteConfig from "#/config/site"

import {
  ActivityButton,
  OrganizationSwitcherButton,
  SelectBoardButton,
  SettingsButton,
  UserClerkButton,
} from "./navbar-items"

type NavbarProps = {
  orgId: string
}

export function Navbar({ orgId }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-6 lg:px-8">
      <div className="container mx-auto flex w-full max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/organization/$orgId"
            params={{ orgId }}
            className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
          >
            <div className="flex items-center text-primary">
              <CheckSquareIcon weight="fill" className="h-6 w-6" />
            </div>
            <span className="hidden text-lg font-semibold tracking-tight sm:block">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 md:flex">
            <SelectBoardButton orgId={orgId} />
            <ActivityButton orgId={orgId} />
            <SettingsButton orgId={orgId} />
          </nav>

          <div className="ml-4 flex items-center gap-3 border-l border-border/40 pl-4">
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
  )
}
