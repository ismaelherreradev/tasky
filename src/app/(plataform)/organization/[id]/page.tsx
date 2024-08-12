import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { api } from "~/trpc/server";
import { LayoutDashboardIcon, PlusIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

import { CreateBoardPopover } from "../../_components/create-board";

export default function OrganizationIdPage() {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  void api.board.getBoards.prefetch({ orgId });
  return (
    <section className="flex flex-col items-center mt-10">
      <h3 className="text-center text-xl font-semibold">No Board Selected</h3>
      <p className="flex items-center text-center text-muted-foreground mb-4">
        Please choose a board by clicking the icon below to get started!
        <LayoutDashboardIcon className="inline ml-2" size={18} />
      </p>
      <CreateBoardPopover sideOffset={5} orgId={orgId}>
        <Button>
          <PlusIcon className="mr-2" size={18} /> Create new board
        </Button>
      </CreateBoardPopover>
    </section>
  );
}
