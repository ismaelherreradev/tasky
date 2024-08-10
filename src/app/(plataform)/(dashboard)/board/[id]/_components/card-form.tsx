"use client";

import { forwardRef, useRef, useState, type ElementRef, type FormEvent } from "react";
import { api } from "~/trpc/react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

type CardFormProps = {
  listId: number;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
};

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    const formRef = useRef<ElementRef<"form">>(null);
    const [title, setTitle] = useState("");

    const utils = api.useUtils();
    const { mutate, error, isPending } = api.card.createCard.useMutation({
      onSuccess: async (data) => {
        await utils.card.invalidate();
        await utils.list.invalidate();

        toast.success(`Card "${data?.title}" created!`);
        resetForm();
      },
    });

    function resetForm() {
      disableEditing();
      setTitle("");
    }

    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        resetForm();
      }
    }

    function handleOutsideClick() {
      resetForm();
    }

    function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    }

    function handleFormSubmit(e: FormEvent) {
      e.preventDefault();
      mutate({ title, listId });
    }

    useOnClickOutside(formRef, handleOutsideClick);
    useEventListener("keydown", handleEscapeKey);

    return (
      <div className="px-2 pt-2">
        {isEditing ? (
          <form ref={formRef} onSubmit={handleFormSubmit} className="m-1 space-y-4 px-1 py-0.5">
            <Textarea
              id="title"
              name="title"
              ref={ref}
              onKeyDown={handleTextareaKeyDown}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(
                "resize-none shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              )}
              placeholder="Enter a title for this card..."
            />
            {error?.data?.zodError?.fieldErrors.title && (
              <span className="mb-8 text-xs text-red-500">
                {error.data.zodError.fieldErrors.title}
              </span>
            )}
            <div className="flex items-center gap-x-1">
              <Button size="sm" type="submit" disabled={isPending}>
                {isPending ? "Add card..." : "Add card"}
              </Button>
              <Button onClick={resetForm} size="sm" variant="ghost">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={enableEditing}
            className="h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground"
            size="sm"
            variant="ghost"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add a card
          </Button>
        )}
      </div>
    );
  },
);

CardForm.displayName = "CardForm";
