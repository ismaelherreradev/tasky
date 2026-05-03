import { Plus as PhosphorPlus, X } from "@phosphor-icons/react"
import { type KeyboardEvent, useCallback, useRef, useState } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"

import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { useCreateList } from "#/hooks/mutations/use-create-list"
import { toastError } from "#/hooks/utils"

import ListWrapper from "./list-wrapper"

const PRESET_COLORS = [
  "#FFB3BA",
  "#FFDFBA",
  "#FFFFBA",
  "#BAFFC9",
  "#BAE1FF",
  "#E1BAFF",
  "#FFBAE1",
  "#BAFFEC",
]

export default function ListForm({ boardId }: { boardId: number }) {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [color, setColor] = useState<string | undefined>()

  const resetForm = useCallback(() => {
    setTitle("")
    setColor(undefined)
    setIsEditing(false)
  }, [])

  const { mutate, isPending } = useCreateList({
    boardId,
    onSuccess: () => resetForm(),
  })

  const enableEditing = useCallback(() => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus())
  }, [])

  const disableEditing = useCallback(() => {
    resetForm()
  }, [resetForm])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        disableEditing()
      }
    },
    [disableEditing],
  )

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      toastError("Title is required")
      return
    }
    mutate({ title: title.trim(), boardId, color })
  }, [title, boardId, color, mutate])

  useEventListener("keydown", () => handleKeyDown)
  useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing)

  return (
    <ListWrapper>
      {isEditing ? (
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="w-full space-y-4 rounded-md bg-muted p-3"
          aria-label="Add new list"
        >
          <Input
            id="list-title"
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-transparent px-2 py-1 text-sm font-medium transition hover:border-input focus:border-input"
            placeholder="Enter list title..."
            aria-label="List title"
            aria-required="true"
          />
          <div className="flex flex-wrap gap-1.5 px-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(color === c ? undefined : c)}
                className={`h-5 w-5 rounded-full transition-transform hover:scale-110 focus:ring-2 focus:ring-ring focus:outline-none ${color === c ? "ring-2 ring-ring ring-offset-2" : ""}`}
                style={{ backgroundColor: c }}
                aria-label={`Select color ${c}`}
                aria-pressed={color === c}
              />
            ))}
          </div>
          <div className="sr-only">Press Enter to create list, Escape to cancel</div>
          <div className="flex items-center gap-x-1">
            <Button
              size="sm"
              type="submit"
              disabled={isPending || !title.trim()}
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
          <PhosphorPlus className="mr-2 h-4 w-4" aria-hidden="true" />
          Add a list
        </button>
      )}
    </ListWrapper>
  )
}
