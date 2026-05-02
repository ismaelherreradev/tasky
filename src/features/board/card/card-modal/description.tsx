import { AlignLeftIcon, PencilIcon } from "@phosphor-icons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type ComponentRef, useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"

import { Button } from "#/components/ui/button"
import { Skeleton } from "#/components/ui/skeleton"
import { Textarea } from "#/components/ui/textarea"
import { toastManager } from "#/components/ui/toast"
import { extractZodError } from "#/hooks/utils"
import { useTRPC } from "#/integrations/trpc/react"
import { cn } from "#/lib/utils"

import type { CardWithList } from "."

type DescriptionProps = {
  data: CardWithList
}

export default function Description({ data }: DescriptionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const formRef = useRef<ComponentRef<"form">>(null)
  const textareaRef = useRef<ComponentRef<"textarea">>(null)

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const updateCard = useMutation({
    ...trpc.card.updateCard.mutationOptions(),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: trpc.card.getCardById.queryKey({ id: data.id }),
      })

      toastManager.add({
        title: "Success",
        id: data.title,
        description: `Card "${data.title}" updated`,
      })

      disableEditing()
    },
    onError: (error) => {
      const errorMessage = extractZodError(error, "description", "Failed to update description")

      toastManager.add({
        title: "Error",
        id: data.title,
        description: errorMessage,
      })
    },
  })

  const enableEditing = () => {
    setIsEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const disableEditing = () => setIsEditing(false)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing()
  }

  useEventListener("keydown", onKeyDown)
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing)

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string
    updateCard.mutate({ id: data.id, description })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-x-3">
        <div className="shrink-0 rounded-lg bg-secondary/50 p-2 text-secondary-foreground">
          <AlignLeftIcon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-foreground">Description</h3>
      </div>

      {isEditing ? (
        <form action={onSubmit} ref={formRef} className="ml-11 space-y-3">
          <Textarea
            id="description"
            name="description"
            placeholder="Add a more detailed description..."
            defaultValue={data.description ?? ""}
            className="min-h-30 resize-none border border-border bg-background text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            ref={textareaRef}
          />
          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={updateCard.isPending} size="sm" className="h-8 px-3">
              {updateCard.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="submit"
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
              "group relative w-full cursor-pointer rounded-lg border-2 border-dashed border-border/60 bg-muted/30 text-left transition-colors hover:bg-muted/50",
              "min-h-20 p-4 text-sm",
              data.description && "border-solid border-border bg-background hover:bg-muted/20",
            )}
          >
            {data.description ? (
              <>
                <p className="leading-relaxed whitespace-pre-wrap text-foreground">
                  {data.description}
                </p>
                <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded border bg-background/80 p-1 shadow-sm backdrop-blur-sm">
                    <PencilIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="space-y-2 text-center">
                  <PencilIcon className="mx-auto h-5 w-5 opacity-40" />
                  <p>Add a more detailed description...</p>
                </div>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-x-3">
        <div className="shrink-0 rounded-lg bg-muted p-2">
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="ml-11">
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  )
}
