import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Paths } from "~/config/site";

export function LandingNavbar() {
  return (
    <nav className="fixed inset-x-0 flex h-20">
      <div className="container flex w-full items-center justify-between gap-4">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight lg:text-2xl">
          Tasky
        </h1>
        <div className="space-x-4">
          <Button size="sm" variant="ghost" asChild>
            <Link to={Paths.SignInPage}>Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={Paths.SignUpPage}>Get started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
