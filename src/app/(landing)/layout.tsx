import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { Paths } from "~/config/site";

import { Navbar } from "./_components/navbar";

export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userId, orgId } = auth();

  if (userId && !orgId) {
    redirect(Paths.SelectOrg);
  }

  if (userId && orgId) {
    redirect(`${Paths.Organization}/${orgId}`);
  }

  return (
    <div>
      <Navbar />
      <main className="container pt-28">{children}</main>
    </div>
  );
}
