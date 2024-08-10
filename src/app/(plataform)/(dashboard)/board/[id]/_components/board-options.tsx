"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import { Paths } from "~/config/site";
import { Button } from "~/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

type BoardOptionsProps = {
  id: number;
  orgId: number;
};

export function BoardOptions({ id, orgId }: BoardOptionsProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const deleteBoard = api.board.deleteBoard.useMutation({
    onSuccess: async () => {
      await utils.board.invalidate();

      router.replace(`${Paths.Organization}/${orgId}`);
    },
    onError: (error) => {
      toast.error(error?.data?.zodError?.fieldErrors.boardId);
    },
  });

  const onDelete = () => {
    deleteBoard.mutate({ boardId: Number(id) });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">Board actions</div>
        <PopoverClose asChild>
          <Button
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={deleteBoard.isPending}
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
}
