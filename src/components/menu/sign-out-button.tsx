import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { forwardRef } from "react";
import { Button } from "~/components/ui/button";
import { Paths } from "~/config/site";
import { cn } from "~/lib/utils";

export const SignOutButton = forwardRef<
  HTMLButtonElement,
  { isOpen: boolean | undefined }
>(({ isOpen }, ref) => {
  const { signOut } = useClerk();

  return (
    <Button
      variant="outline"
      className="mt-5 h-10 w-full justify-center"
      onClick={() => signOut({ redirectUrl: Paths.LandingPage })}
      ref={ref}
    >
      <span className={cn(isOpen === false ? "" : "mr-4")}>
        <LogOut size={18} />
      </span>
      <p
        className={cn(
          "whitespace-nowrap",
          isOpen === false ? "hidden opacity-0" : "opacity-100",
        )}
      >
        Sign out
      </p>
    </Button>
  );
});

SignOutButton.displayName = "SignOutButton";
