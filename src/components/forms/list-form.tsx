import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, X } from "lucide-react"
import { type KeyboardEvent, useCallback, useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"

import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { useTRPC } from "#/integrations/trpc/react"

import ListWrapper from "../board/list/list-wrapper"
import { toastManager } from "../ui/toast"

export default function ListForm({ boardId }: { boardId: number }) {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate, error, isPending } = useMutation({
    ...trpc.list.createList.mutationOptions(),

    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: trpc.list.getlistsWithCards.queryKey() })

      toastManager.add({
        title: "Success",
        id: data.title,
        description: `List "${data.title}" created!`,
      })
      resetForm()
    },
  })

  const resetForm = useCallback(() => {
    setIsEditing(false)
    setTitle("")
  }, [])

  const enableEditing = useCallback(() => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus())
  }, [])

  const disableEditing = useCallback(() => setIsEditing(false), [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        disableEditing()
      }
    },
    [disableEditing],
  )

  useEventListener("keydown", () => handleKeyDown)
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing)

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({ title, boardId })
  }

  return (
    <ListWrapper>
      {isEditing ? (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full space-y-4 rounded-md bg-muted p-3"
          aria-label="Add new list"
        >
          <Input
            id="title"
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-transparent px-2 py-1 text-sm font-medium transition hover:border-input focus:border-input"
            placeholder="Enter list title..."
            aria-label="List title"
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
                ? "list-title-error"
                : "list-title-help"
            }
          />
          <div id="list-title-help" className="sr-only">
            Press Enter to create list, Escape to cancel
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
                id="list-title-error"
                className="mb-8 text-xs text-red-500"
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
              aria-label={isPending ? "Adding list, please wait" : "Add list to board"}
            >
              {isPending ? "Add list..." : "Add list"}
            </Button>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
              aria-label="Cancel adding list"
              type="button"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={enableEditing}
          className="flex w-full items-center rounded-md bg-muted/75 p-3 text-sm font-medium transition hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Add a new list to this board"
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a list
        </button>
      )}
    </ListWrapper>
  )
}
