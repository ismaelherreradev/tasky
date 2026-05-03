import { Plus as PhosphorPlus, X } from "@phosphor-icons/react"
import { forwardRef, useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"

import { Button } from "#/components/ui/button"
import { Textarea } from "#/components/ui/textarea"
import { useCreateCard } from "#/hooks/mutations/use-create-card"
import { toastError } from "#/hooks/utils"
import { cn } from "#/lib/utils"

type CardFormProps = {
  listId: number
  boardId: number
  enableEditing: () => void
  disableEditing: () => void
  isEditing: boolean
}

export default forwardRef<HTMLTextAreaElement, CardFormProps>(function CardForm(
  { listId, boardId, enableEditing, disableEditing, isEditing },
  ref,
) {
  const [title, setTitle] = useState("")

  const formRef = useRef<HTMLFormElement>(null)

  function resetForm() {
    disableEditing()
    setTitle("")
  }

  const { mutate, isPending } = useCreateCard({
    listId,
    boardId,
    onSuccess: () => resetForm(),
  })

  function handleEscapeKey(e: KeyboardEvent) {
    if (e.key === "Escape") {
      resetForm()
    }
  }

  function handleOutsideClick() {
    resetForm()
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSubmit() {
    if (!title.trim()) {
      toastError("Title is required")
      return
    }
    mutate({ title: title.trim(), listId })
  }

  useOnClickOutside(formRef as React.RefObject<HTMLElement>, handleOutsideClick)
  useEventListener("keydown", handleEscapeKey)

  return (
    <div className="px-2 pt-2">
      {isEditing ? (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="m-1 space-y-4 px-1 py-0.5"
          aria-label="Add new card"
        >
          <Textarea
            id="card-title"
            name="title"
            ref={ref}
            onKeyDown={handleTextareaKeyDown}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn(
              "resize-none shadow-sm ring-0 outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            )}
            placeholder="Enter a title for this card..."
            aria-label="Card title"
            aria-required="true"
          />
          <div id="card-title-help" className="sr-only">
            Press Enter to create card, Shift+Enter for new line, Escape to cancel
          </div>
          <div className="flex items-center gap-x-1">
            <Button
              size="sm"
              type="submit"
              disabled={isPending || !title.trim()}
              aria-label={isPending ? "Adding card, please wait" : "Add card to list"}
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
          className="h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground"
          size="sm"
          variant="ghost"
          aria-label="Add a new card to this list"
        >
          <PhosphorPlus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a card
        </Button>
      )}
    </div>
  )
})
