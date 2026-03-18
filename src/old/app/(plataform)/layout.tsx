import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "~/components/navigation";
import { Paths } from "~/config/site";
import { HydrateClient } from "~/trpc/server";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { orgId } = await auth();

  if (!orgId) {
    redirect(Paths.SelectOrg);
  }

  return (
    <HydrateClient>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar orgId={orgId} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </HydrateClient>
  );
}
