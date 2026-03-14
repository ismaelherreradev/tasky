import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Paths } from "~/config/site";

export default async function LandingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId, orgId } = await auth();

  if (userId && !orgId) {
    redirect(Paths.SelectOrg);
  }

  if (userId && orgId) {
    redirect(`${Paths.Organization}/${orgId}`);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">{children}</main>
  );
}
