import "~/styles/globals.css";

import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "~/env";
import { recursive } from "~/fonts";
import { TRPCReactProvider } from "~/trpc/react";

import { SiteConfig } from "~/config/site";
import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: SiteConfig.title,
    template: "%s | " + SiteConfig.title,
  },
  description: SiteConfig.description,
  icons: [
    {
      url: "/tasky.svg",
      href: "/tasky.svg",
    },
  ],
  openGraph: {
    images: ["/tasky.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${recursive.variable}`} suppressHydrationWarning>
      <body className="overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClerkProvider publishableKey={env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ClerkProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
