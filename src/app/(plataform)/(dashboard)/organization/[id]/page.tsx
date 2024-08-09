import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "~/components/ui/breadcrumb";
import { api, HydrateClient } from "~/trpc/server";

import { ContentLayout } from "../../_components/content-layout";
import { BoardList } from "./_components/board-list";

export default function OrganizationIdPage() {
  const { orgSlug, orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const orgName = orgSlug ?? "Workspace";

  void api.board.getBoards.prefetch({ orgId });
  return (
    <HydrateClient>
      <ContentLayout title={orgName}>
        {/*
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Workspace</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{orgName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>{" "}
      */}
        <BoardList orgId={orgId} />
      </ContentLayout>
    </HydrateClient>
  );
}
