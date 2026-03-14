"use client";

import { Plus, X } from "lucide-react";
import {
  type ElementRef,
  type FormEvent,
  forwardRef,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type CardFormProps = {
  listId: number;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
};

export default forwardRef<HTMLTextAreaElement, CardFormProps>(function CardForm(
  { listId, enableEditing, disableEditing, isEditing },
  ref,
) {
  const formRef = useRef<ElementRef<"form">>(null);
  const [title, setTitle] = useState("");

  const utils = api.useUtils();
  const { mutate, error, isPending } = api.card.createCard.useMutation({
    onSuccess: async (data) => {
      await utils.card.getCardsByListId.invalidate({ listId });
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

  useOnClickOutside(
    formRef as React.RefObject<HTMLElement>,
    handleOutsideClick,
  );
  useEventListener("keydown", handleEscapeKey);

  return (
    <div className="px-2 pt-2">
      {isEditing ? (
        <form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="m-1 space-y-4 px-1 py-0.5"
          aria-label="Add new card"
        >
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
            aria-label="Card title"
            aria-required="true"
            aria-invalid={
              !!(
                error?.data &&
                "zodError" in error.data &&
                error.data.zodError &&
                typeof error.data.zodError === "object" &&
                "fieldErrors" in error.data.zodError &&
                error.data.zodError.fieldErrors &&
                typeof error.data.zodError.fieldErrors === "object" &&
                "title" in error.data.zodError.fieldErrors
              )
            }
            aria-describedby={
              error?.data &&
              "zodError" in error.data &&
              error.data.zodError &&
              typeof error.data.zodError === "object" &&
              "fieldErrors" in error.data.zodError &&
              error.data.zodError.fieldErrors &&
              typeof error.data.zodError.fieldErrors === "object" &&
              "title" in error.data.zodError.fieldErrors
                ? "card-title-error"
                : "card-title-help"
            }
          />
          <div id="card-title-help" className="sr-only">
            Press Enter to create card, Shift+Enter for new line, Escape to
            cancel
          </div>
          {error?.data &&
            "zodError" in error.data &&
            error.data.zodError &&
            typeof error.data.zodError === "object" &&
            "fieldErrors" in error.data.zodError &&
            error.data.zodError.fieldErrors &&
            typeof error.data.zodError.fieldErrors === "object" &&
            "title" in error.data.zodError.fieldErrors && (
              <span
                id="card-title-error"
                className="mb-8 text-red-500 text-xs"
                role="alert"
                aria-live="polite"
              >
                {String(error.data.zodError.fieldErrors.title)}
              </span>
            )}
          <div className="flex items-center gap-x-1">
            <Button
              size="sm"
              type="submit"
              disabled={isPending}
              aria-label={
                isPending ? "Adding card, please wait" : "Add card to list"
              }
            >
              {isPending ? "Add card..." : "Add card"}
            </Button>
            <Button
              onClick={resetForm}
              size="sm"
              variant="ghost"
              aria-label="Cancel adding card"
              type="button"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={enableEditing}
          className="h-auto w-full justify-start px-2 py-1.5 text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
          aria-label="Add a new card to this list"
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a card
        </Button>
      )}
    </div>
  );
});
