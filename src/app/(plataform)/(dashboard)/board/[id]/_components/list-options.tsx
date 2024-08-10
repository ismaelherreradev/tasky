import { useRef, type ElementRef } from "react";
import type { ListSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";

type ListOptionsProps = {
  data: ListSelect;
  onAddCard: () => void;
};

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const deleteList = api.list.deleteList.useMutation({
    onSuccess: async (data) => {
      toast.success(`List "${data?.title}" deleted`);
      closeRef.current?.click();
    },
  });

  const copyList = api.list.copyList.useMutation({
    onSuccess: async (data) => {
      toast.success(`List "${data?.title}" copied`);
      closeRef.current?.click();
    },
  });

  function onDelete(formData: FormData) {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    deleteList.mutate({ listId: Number(id), boardId: Number(boardId) });
  }

  function onCopy(formData: FormData) {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    copyList.mutate({ listId: Number(id), boardId: Number(boardId) });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">List actions</div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          variant="ghost"
        >
          Add card...
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input hidden name="boardId" id="boardId" defaultValue={data.boardId} />
          <Button
            size="sm"
            type="submit"
            disabled={copyList.isPending}
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          >
            Copy list...
          </Button>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden name="id" id="id" defaultValue={data.id} />
          <input hidden name="boardId" id="boardId" defaultValue={data.boardId} />
          <Button
            size="sm"
            type="submit"
            disabled={deleteList.isPending}
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          >
            Delete this list
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
