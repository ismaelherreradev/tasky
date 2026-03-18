import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Paths } from "~/config/site";

export async function LandingNavbar() {
  return (
    <nav className="fixed inset-x-0 flex h-20">
      <div className="container flex w-full items-center justify-between gap-4">
        <h1 className="scroll-m-20 font-semibold text-2xl tracking-tight lg:text-2xl">
          Tasky
        </h1>
        <div className="space-x-4">
          <Button size="sm" variant="ghost" asChild>
            <Link href={Paths.SignInPage}>Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={Paths.SignUpPage}>Get started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
