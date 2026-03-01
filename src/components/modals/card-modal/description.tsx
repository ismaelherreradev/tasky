"use client";

import { AlignLeft, Edit3 } from "lucide-react";
import { type ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import type { CardWithList } from ".";

type DescriptionProps = {
  data: CardWithList;
};

export function Description({ data }: DescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const utils = api.useUtils();
  const updateCard = api.card.updateCard.useMutation({
    onSuccess: async (updatedCard) => {
      await utils.card.getCardById.invalidate({
        id: updatedCard?.id as number,
      });
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      const errorMessage =
        error?.data &&
        "zodError" in error.data &&
        error.data.zodError &&
        typeof error.data.zodError === "object" &&
        "fieldErrors" in error.data.zodError &&
        error.data.zodError.fieldErrors &&
        typeof error.data.zodError.fieldErrors === "object" &&
        "description" in error.data.zodError.fieldErrors
          ? String(error.data.zodError.fieldErrors.description)
          : "Failed to update description";
      toast.error(errorMessage);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const disableEditing = () => setIsEditing(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    updateCard.mutate({ id: data.id, description });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-x-3">
        <div className="bg-secondary/50 text-secondary-foreground shrink-0 rounded-lg p-2">
          <AlignLeft className="h-4 w-4" />
        </div>
        <h3 className="text-foreground font-semibold">Description</h3>
      </div>

      {isEditing ? (
        <form action={onSubmit} ref={formRef} className="ml-11 space-y-3">
          <Textarea
            id="description"
            name="description"
            placeholder="Add a more detailed description..."
            defaultValue={data.description ?? ""}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 min-h-[120px] resize-none border transition-colors focus:ring-2"
            ref={textareaRef}
          />
          <div className="flex items-center gap-x-2">
            <Button
              disabled={updateCard.isPending}
              size="sm"
              className="h-8 px-3"
            >
              {updateCard.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              onClick={disableEditing}
              size="sm"
              variant="ghost"
              className="h-8 px-3"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="ml-11">
          <button
            type="button"
            onClick={enableEditing}
            className={cn(
              "group border-border/60 bg-muted/30 hover:bg-muted/50 relative w-full cursor-pointer rounded-lg border-2 border-dashed text-left transition-colors",
              "min-h-[80px] p-4 text-sm",
              data.description &&
                "border-border bg-background hover:bg-muted/20 border-solid",
            )}
          >
            {data.description ? (
              <>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {data.description}
                </p>
                <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="bg-background/80 rounded border p-1 shadow-sm backdrop-blur-sm">
                    <Edit3 className="text-muted-foreground h-3 w-3" />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                <div className="space-y-2 text-center">
                  <Edit3 className="mx-auto h-5 w-5 opacity-40" />
                  <p>Add a more detailed description...</p>
                </div>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-x-3">
        <div className="bg-muted shrink-0 rounded-lg p-2">
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="ml-11">
        <Skeleton className="h-[80px] w-full rounded-lg" />
      </div>
    </div>
  );
};
