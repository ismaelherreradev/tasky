import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { Provider } from "jotai";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

import { BoardNavbar } from "./_components/board-navbar";
import { ListContainer } from "./_components/list-container";
import { CardModal } from "./_components/modal";

type BoardIdPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: BoardIdPageProps) {
  const { orgId } = auth();

  if (!orgId) {
    return {
      title: "Board",
    };
  }

  const board = await api.board.getBoardById({
    boardId: Number(params.id),
    orgId,
  });

  return {
    title: board?.title ?? "Board",
  };
}

export default async function BoardIdPage({ params }: BoardIdPageProps) {
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
    <Provider>
      <CardModal />
      <div className="space-y-5 mb-5">
        <BoardNavbar data={board} orgId={orgId} />
        <ScrollArea>
          <div className="mb-10">
            <ListContainer boardId={board.id} />
          </div>
          <ScrollBar hidden orientation="horizontal" />
        </ScrollArea>
      </div>
    </Provider>
  );
}
