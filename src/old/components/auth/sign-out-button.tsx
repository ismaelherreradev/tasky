"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { Paths } from "~/config/site";

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
