import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import * as React from "react"
import { useEffect, useRef, useState } from "react"

import { cn } from "#/lib/utils"

type DroppableAreaProps = {
  id: string
  className?: string
  children?: React.ReactNode
}

export default function DroppableArea({ id, className, children }: DroppableAreaProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isOver, setIsOver] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({ type: "list", id }),
      canDrop: ({ source }) => source.data?.type === "card",
      onDragEnter: () => setIsOver(true),
      onDragLeave: ({ source }) => {
        if (source.data?.type === "card") {
          setIsOver(false)
        }
      },
      onDrop: () => setIsOver(false),
    })
    return () => cleanup()
  }, [id])

  const hasCards = React.Children.count(children) > 0

  return (
    <div
      ref={ref}
      className={cn(
        "min-h-5 rounded-md border-2 border-dashed transition-all duration-200",
        isOver
          ? cn("border-primary bg-primary/10", !hasCards && "border-primary/80")
          : "border-transparent",
        className,
      )}
    >
      {hasCards ? (
        <div
          className={cn(
            "flex min-h-5 flex-col gap-y-2 py-1",
            isOver && "-mt-0.5 border-t-2 border-primary/40",
          )}
        >
          {children}
        </div>
      ) : (
        <div
          className={cn(
            "flex h-24 items-center justify-center rounded-md transition-all duration-200",
            isOver ? "bg-primary/15" : "bg-muted/30",
          )}
        >
          <span
            className={cn("text-sm font-medium", isOver ? "text-primary" : "text-muted-foreground")}
          >
            Drop cards here
          </span>
        </div>
      )}
    </div>
  )
}
