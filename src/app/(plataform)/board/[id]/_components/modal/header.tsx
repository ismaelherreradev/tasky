"use client";

import { useRef, useState, type ElementRef } from "react";
import { api } from "~/trpc/react";
import { Layout } from "lucide-react";
import { toast } from "sonner";

import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";

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
      setTitle(updatedCard?.title ?? "");
    },
    onError: (error) => {
      toast.error(error?.data?.zodError?.fieldErrors.title);
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
    <div className="mb-6 flex w-full items-start gap-x-3">
      <Layout className="mt-1 h-5 w-5 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <Input
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            name="title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            className="relative -left-1.5 mb-0.5 w-[95%] truncate border-transparent bg-transparent px-1 text-xl font-semibold"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="mb-6 flex items-start gap-x-3">
      <Skeleton className="mt-1 h-6 w-6 bg-neutral-200" />
      <div>
        <Skeleton className="mb-1 h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-4 w-12 bg-neutral-200" />
      </div>
    </div>
  );
};
