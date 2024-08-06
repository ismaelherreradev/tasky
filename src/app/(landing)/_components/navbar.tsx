import Link from "next/link";

import { Button } from "~/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed inset-x-0 flex h-20">
      <div className="container flex w-full items-center justify-end gap-4">
        <Button size={"sm"} variant={"ghost"} asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>

        <Button size={"sm"} asChild>
          <Link href="/sign-up">Get started</Link>
        </Button>
      </div>
    </nav>
  );
}
