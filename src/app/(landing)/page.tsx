import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Paths } from "~/config/site";

export default function LandingPage() {
  const { userId, orgId } = auth();

  if (userId && !orgId) {
    redirect(Paths.SelectOrg);
  }

  if (userId && orgId) {
    redirect(`${Paths.Organization}/${orgId}`);
  }

  return (
    <div>
      <h1>Hi</h1>
    </div>
  );
}
