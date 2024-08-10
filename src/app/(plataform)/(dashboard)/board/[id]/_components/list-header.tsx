import { useRef, useState, type ElementRef } from "react";
import type { ListSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";

import { Input } from "~/components/ui/input";

import { ListOptions } from "./list-options";

type ListHeaderProps = {
  data: ListSelect;
  onAddCard: () => void;
};

export function ListHeader({ data, onAddCard }: ListHeaderProps) {
  const { mutate: updateList } = api.list.updateList.useMutation({
    onSuccess: async (data) => {
      toast.success(`Renamed to "${data?.title}"`);
      setTitle(data?.title ?? "");
      disableEditing();
    },
  });

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => setIsEditing(false);

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) return disableEditing();

    updateList({ title, listId: Number(id), boardId: Number(boardId) });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener("keydown", handleKeyDown);

  return (
    <div className="flex justify-between items-start gap-x-2 px-2 pt-2 text-sm font-semibold">
      {isEditing ? (
        <form ref={formRef} action={handleSubmit} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" defaultValue={data.id} />
          <input hidden id="boardId" name="boardId" defaultValue={data.boardId} />
          <Input
            id="title"
            name="title"
            ref={inputRef}
            value={title}
            onBlur={() => formRef.current?.requestSubmit()}
            onChange={(e) => setTitle(e.target.value)}
            className="border-transparent px-2 py-1 text-sm font-medium transition hover:border-input focus:border-input"
            placeholder="Enter list title..."
          />
          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="h-7 w-full border-transparent px-2.5 py-1 text-sm font-medium"
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
}
