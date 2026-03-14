"use client";

import { CreditCard } from "lucide-react";
import { type ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

import type { CardWithList } from ".";

type HeaderProps = {
  data: CardWithList;
};

export function Header({ data }: HeaderProps) {
  const [title, setTitle] = useState(data?.title);

  const utils = api.useUtils();
  const updateCard = api.card.updateCard.useMutation({
    onSuccess: async (updatedCard) => {
      await utils.list.invalidate();
      toast.success(`Renamed to "${updatedCard?.title}"`);
      setTitle((updatedCard?.title as string) ?? "");
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
        "title" in error.data.zodError.fieldErrors
          ? String(error.data.zodError.fieldErrors.title)
          : "Failed to update card title";
      toast.error(errorMessage);
    },
  });

  const inputRef = useRef<ElementRef<"input">>(null);

  function onBlur() {
    inputRef.current?.form?.requestSubmit();
  }

  function onSubmit(formData: FormData) {
    const title = formData.get("title") as string;

    if (title === data.title) {
      return;
    }

    updateCard.mutate({
      title,
      id: data.id,
    });
  }

  return (
    <div className="flex w-full items-start gap-x-3">
      <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
        <CreditCard className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <form action={onSubmit}>
          <Input
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            name="title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            className="resize-none border-none bg-transparent px-0 font-bold text-foreground text-xl shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Card title"
          />
        </form>
        <div className="mt-1 flex items-center gap-2 text-muted-foreground text-sm">
          <span>in list</span>
          <span className="rounded bg-muted/50 px-2 py-0.5 font-medium text-xs">
            {data.list.title}
          </span>
        </div>
      </div>
    </div>
  );
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3">
      <div className="shrink-0 rounded-lg bg-muted p-2">
        <Skeleton className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-7 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
      </div>
    </div>
  );
};
