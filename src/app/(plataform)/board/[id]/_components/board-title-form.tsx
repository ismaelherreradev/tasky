"use client";

import { useRef, useState } from "react";
import type { BoardSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type BoardTitleFormProps = {
  data: BoardSelect;
};

export function BoardTitleForm({ data }: BoardTitleFormProps) {
  const utils = api.useUtils();
  const updateBoard = api.board.updateBoard.useMutation({
    onSuccess: async (updatedData) => {
      await utils.board.invalidate();
      toast.success(`Board "${updatedData?.title}" updated!`);
      setTitle(updatedData?.title ?? "");
      disableEditing();
    },
    onError: (error) => {
      toast.error(error?.data?.zodError?.fieldErrors.title);
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data?.title);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => setIsEditing(false);

  const handleSubmit = (formData: FormData) => {
    const newTitle = formData.get("title") as string;
    if (newTitle === data.title) {
      return disableEditing();
    }
    updateBoard.mutate({ boardId: data.id, title: newTitle });
  };

  const handleBlur = () => inputRef.current?.form?.requestSubmit();

  return isEditing ? (
    <form action={handleSubmit} className="flex items-center gap-x-2">
      <Input
        ref={inputRef}
        id="title"
        name="title"
        onBlur={handleBlur}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-7 border-none border-ring bg-transparent px-[7px] py-1 text-lg font-bold focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-transparent"
      />
    </form>
  ) : (
    <Button
      onClick={enableEditing}
      variant={"transparent"}
      className="h-auto w-auto p-1 px-2 text-lg font-bold"
    >
      {title}
    </Button>
  );
}
