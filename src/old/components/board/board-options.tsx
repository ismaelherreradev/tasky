"use client";

import { MoreHorizontal, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ConfirmationDialog } from "~/components/ui/confirmation-dialog";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Paths } from "~/config/site";
import { api } from "~/trpc/react";

type BoardOptionsProps = {
  id: number;
  orgId: string;
};

export function BoardOptions({ id, orgId }: BoardOptionsProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const deleteBoard = api.board.deleteBoard.useMutation({
    onSuccess: async () => {
      toast.success("Board deleted successfully");
      await utils.board.invalidate();
      setShowDeleteDialog(false);
      setShowPopover(false);
      router.replace(`${Paths.Organization}/${orgId}`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            data?: { zodError?: { fieldErrors?: { boardId?: string[] } } };
            message?: string;
          }
        )?.data?.zodError?.fieldErrors?.boardId?.[0] ??
        (error as { message?: string })?.message ??
        "Failed to delete board. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleDeleteConfirm = () => {
    deleteBoard.mutate({ boardId: Number(id) });
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            aria-label="Board options menu"
            aria-haspopup="true"
            aria-expanded={showPopover}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="relative w-48 px-0 py-3"
          side="bottom"
          align="end"
          role="menu"
          aria-labelledby="board-actions-title"
        >
          <PopoverClose asChild>
            <Button
              className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              variant="ghost"
              size="sm"
              aria-label="Close board options menu"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </Button>
          </PopoverClose>
          <div
            id="board-actions-title"
            className="px-3 pr-8 pb-3 font-medium text-muted-foreground text-xs uppercase tracking-wider"
          >
            Board actions
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowDeleteDialog(true)}
            className="h-9 w-full justify-start rounded-none px-3 font-normal text-destructive text-sm hover:bg-destructive/10 hover:text-destructive"
            role="menuitem"
            aria-label="Delete this board permanently"
          >
            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
            Delete board
          </Button>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Board"
        variant="destructive"
        confirmLabel={deleteBoard.isPending ? "Deleting..." : "Delete Board"}
        isLoading={deleteBoard.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        aria-describedby="delete-board-description"
      >
        <div
          id="delete-board-description"
          className="text-muted-foreground text-sm"
        >
          <p className="mb-2">
            Are you sure you want to delete this board? This action cannot be
            undone and will permanently delete:
          </p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>All lists in this board</li>
            <li>All cards in those lists</li>
            <li>All associated data</li>
          </ul>
          <p className="mt-2 font-medium text-destructive" role="alert">
            This action is irreversible.
          </p>
        </div>
      </ConfirmationDialog>
    </>
  );
}
