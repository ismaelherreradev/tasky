// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// import { Paths } from "~/config/site";

// export default async function OrganizationIdPage() {
//   const { orgId } = auth();

//   if (!orgId) {
//     redirect(Paths.SelectOrg);
//   }

//   return (
//     <div>
//       <h1>hi</h1>
//     </div>
//   );
// }

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ContentLayout } from "../../_components/content-layout";

export default function OrganizationIdPage() {
  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1>hi</h1>
    </ContentLayout>
  );
}
