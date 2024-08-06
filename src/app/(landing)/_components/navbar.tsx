import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "~/components/ui/button";

import { TriangleRightIcon } from "@radix-ui/react-icons";

import { Paths } from "~/config/site";

import { SignOutButton } from "./sign-out-button";

function UserButtons() {
  return (
    <>
      <SignOutButton />
      <Button size="sm" asChild>
        <Link href={Paths.Organization}>
          Dashboard <TriangleRightIcon className="h-5 w-5" />
        </Link>
      </Button>
    </>
  );
}

function AuthButtons() {
  return (
    <>
      <Button size="sm" variant="ghost" asChild>
        <Link href={Paths.SignInPage}>Sign in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href={Paths.SignUpPage}>Get started</Link>
      </Button>
    </>
  );
}

export async function Navbar() {
  const { userId }: { userId: string | null } = auth();

  return (
    <nav className="fixed inset-x-0 flex h-20">
      <div className="container flex w-full items-center justify-end gap-4">
        {userId ? <UserButtons /> : <AuthButtons />}
      </div>
    </nav>
  );
}
