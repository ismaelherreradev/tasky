import { ClerkProvider } from "@clerk/nextjs";

import { env } from "~/env";

export default function PlataformLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <main className="min-h-svh">{children}</main>
    </ClerkProvider>
  );
}
