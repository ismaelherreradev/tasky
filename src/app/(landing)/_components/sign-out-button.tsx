"use client";

import { useClerk } from "@clerk/nextjs";

import { Paths } from "~/config/site";
import { Button } from "~/components/ui/button";

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      onClick={() => signOut({ redirectUrl: Paths.LandingPage })}
    >
      Sign out
    </Button>
  );
}
