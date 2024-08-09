import Link from "next/link";
import { Button } from "~/components/ui/button";

import { Paths } from "~/config/site";

export async function Navbar() {
  return (
    <nav className="fixed inset-x-0 flex h-20">
      <div className="container flex w-full items-center justify-end gap-4">
        <Button size="sm" variant="ghost" asChild>
          <Link href={Paths.SignInPage}>Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={Paths.SignUpPage}>Get started</Link>
        </Button>
      </div>
    </nav>
  );
}
