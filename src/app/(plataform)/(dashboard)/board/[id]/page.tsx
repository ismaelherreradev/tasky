import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { api, HydrateClient } from "~/trpc/server";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

import { ContentLayout } from "../../_components/content-layout";
import { ListContainer } from "./_components/list-container";

export default async function BoardIdPage({ params }: { params: { id: string } }) {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await api.board.getBoardById({
    boardId: Number(params.id),
    orgId,
  });

  if (!board) {
    return;
  }

  void api.list.getlistsWithCards.prefetch({ boardId: board.id });
  return (
    <HydrateClient>
      <div className="min-h-svh">
        <ContentLayout title={board?.title}>
          <ScrollArea className="h-[500px]">
            <ListContainer boardId={board.id} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ContentLayout>
      </div>
    </HydrateClient>
  );
}
