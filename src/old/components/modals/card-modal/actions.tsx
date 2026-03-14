"use client";

import { useAtom } from "jotai";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { onCloseAtom } from "~/hooks/use-card-modal";
import { api } from "~/trpc/react";

import type { CardWithList } from ".";

type ActionsProps = {
  data: CardWithList;
};

export function Actions({ data }: ActionsProps) {
  const params = useParams();
  const [, onClose] = useAtom(onCloseAtom);

  const utils = api.useUtils();

  const { mutate: copyCard, isPending: isCopying } =
    api.card.copyCard.useMutation({
      onSuccess: async (copiedCard) => {
        toast.success(`Card "${copiedCard?.title}" copied`);
        onClose();
        await utils.list.getlistsWithCards.invalidate({
          boardId: Number(params.id),
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          (
            error as {
              data?: { zodError?: { fieldErrors?: { title?: string } } };
            }
          )?.data?.zodError?.fieldErrors?.title ?? "Failed to copy card";
        toast.error(errorMessage);
      },
    });

  const { mutate: deleteCard, isPending: isDeleting } =
    api.card.deleteCard.useMutation({
      onSuccess: async (deletedCard) => {
        toast.success(`Card "${deletedCard.title}" deleted`);
        onClose();
        await utils.list.getlistsWithCards.invalidate({
          boardId: Number(params.id),
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          (
            error as {
              data?: { zodError?: { fieldErrors?: { title?: string } } };
            }
          )?.data?.zodError?.fieldErrors?.title ?? "Failed to delete card";
        toast.error(errorMessage);
      },
    });

  const handleCopy = () => {
    const boardId = Number(params.id);
    if (Number.isNaN(boardId)) {
      toast.error("Invalid board ID");
      return;
    }

    copyCard({
      id: data.id,
      boardId,
    });
  };

  const handleDelete = () => {
    const boardId = Number(params.id);
    if (Number.isNaN(boardId)) {
      toast.error("Invalid board ID");
      return;
    }

    deleteCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-2 font-semibold text-foreground text-sm">
        <MoreHorizontal className="h-4 w-4" />
        Actions
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleCopy}
          disabled={isCopying}
          variant="ghost"
          className="h-9 w-full justify-start px-3 transition-colors hover:bg-muted"
          size="sm"
        >
          <Copy className="mr-3 h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{isCopying ? "Copying..." : "Copy"}</span>
        </Button>

        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="ghost"
          className="group h-9 w-full justify-start px-3 transition-colors hover:bg-destructive/10 hover:text-destructive"
          size="sm"
        >
          <Trash2 className="mr-3 h-4 w-4 text-muted-foreground transition-colors group-hover:text-destructive" />
          <span className="text-sm">
            {isDeleting ? "Deleting..." : "Delete"}
          </span>
        </Button>
      </div>
    </div>
  );
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
};
