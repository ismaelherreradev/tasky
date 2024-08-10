"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Copy, Trash } from "lucide-react";
import { toast } from "sonner";

import { useCardModal } from "~/hooks/use-card-modal";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

import type { CardWithList } from ".";

type ActionsProps = {
  data: CardWithList;
};

export function Actions({ data }: ActionsProps) {
  const params = useParams();
  const cardModal = useCardModal();

  const utils = api.useUtils();

  const { mutate: copyCard, isPending: isCopying } = api.card.copyCard.useMutation({
    onSuccess: async (copiedCard) => {
      toast.success(`Card "${copiedCard?.title}" copied`);
      cardModal.onClose();
      await utils.list.getlistsWithCards.invalidate({ boardId: Number(params.id) });
    },
    onError: (error) => {
      toast.error(error?.data?.zodError?.fieldErrors.title);
    },
  });

  const { mutate: deleteCard, isPending: isDeleting } = api.card.deleteCard.useMutation({
    onSuccess: async (deletedCard) => {
      toast.success(`Card "${deletedCard.title}" deleted`);
      cardModal.onClose();
      await utils.list.getlistsWithCards.invalidate({ boardId: Number(params.id) });
    },
    onError: (error) => {
      toast.error(error?.data?.zodError?.fieldErrors.title);
    },
  });

  const handleCopy = () => {
    const boardId = Number(params.id);
    if (isNaN(boardId)) {
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
    if (isNaN(boardId)) {
      toast.error("Invalid board ID");
      return;
    }

    deleteCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={handleCopy}
        disabled={isCopying}
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full justify-start"
        variant="destructive"
        size="inline"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="mt-2 space-y-2">
      <Skeleton className="h-4 w-20 bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
    </div>
  );
};
