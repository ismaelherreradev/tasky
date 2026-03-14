import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BoardsClient } from "~/components/organization";
import type { BoardSelect } from "~/server/db/schema";
import { api } from "~/trpc/server";

export default async function OrganizationIdPage() {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = (await api.board.getBoards({ orgId })) as BoardSelect[] | null;

  return <BoardsClient initialBoards={boards} orgId={orgId} />;
}
