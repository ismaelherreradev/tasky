"use client";

import { useRef, useState, type ElementRef } from "react";
import { api } from "~/trpc/react";
import { AlignLeft } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";

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
      await utils.card.getCardById.invalidate({ id: updatedCard?.id });
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error?.data?.zodError?.fieldErrors.description);
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
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    updateCard.mutate({ id: data.id, description });
  };

  return (
    <div className="flex w-full items-start gap-x-3">
      <AlignLeft className="mt-0.5 h-5 w-5 text-neutral-700" />
      <div className="w-full">
        <p className="mb-2 font-semibold text-neutral-700">Description</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <Textarea
              id="description"
              name="description"
              placeholder="Add a more detailed description"
              defaultValue={data.description ?? ""}
              className={cn(
                "resize-none shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 mt-2 w-full",
              )}
              ref={textareaRef}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={updateCard.isPending}>Save</Button>
              <Button type="button" onClick={disableEditing} size="sm" variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] rounded-md bg-muted px-3.5 py-3 text-sm font-medium"
          >
            {data.description ?? "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex w-full items-start gap-x-3">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="mb-2 h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
