"use client";

import { useCallback, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { ListWrapper } from "./list-wrapper";

export function ListForm() {
  const params = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  const utils = api.useUtils();
  const { mutate, error, isPending } = api.list.createList.useMutation({
    onSuccess: async (data) => {
      await utils.card.invalidate();
      await utils.list.invalidate();

      toast.success(`List "${data?.title}" created!`);
      resetForm();
    },
  });

  const resetForm = useCallback(() => {
    setIsEditing(false);
    setTitle("");
  }, []);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus());
  }, []);

  const disableEditing = useCallback(() => setIsEditing(false), []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    },
    [disableEditing],
  );

  useEventListener("keydown", () => handleKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ title, boardId: Number(params.id) });
  };

  return (
    <ListWrapper>
      {isEditing ? (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full space-y-4 rounded-md bg-muted p-3"
        >
          <Input
            id="title"
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-transparent px-2 py-1 text-sm font-medium transition hover:border-input focus:border-input"
            placeholder="Enter list title..."
          />
          {error?.data?.zodError?.fieldErrors.title && (
            <span className="mb-8 text-xs text-red-500">
              {error.data.zodError.fieldErrors.title}
            </span>
          )}
          <div className="flex items-center gap-x-1">
            <Button size="sm" type="submit" disabled={isPending}>
              {isPending ? "Add list..." : "Add list"}
            </Button>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={enableEditing}
          className="flex w-full items-center rounded-md bg-muted/75 p-3 text-sm font-medium transition hover:bg-muted"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add a list
        </button>
      )}
    </ListWrapper>
  );
}
