import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {
  CalendarBlank as PhosphorCalendarBlank,
  Chat as PhosphorChats,
} from "@phosphor-icons/react"
import React, { useEffect, useRef, useState } from "react"

import { openCardModal } from "#/hooks/use-card-modal"
import { cn } from "#/lib/utils"
import type { CardSelect } from "#/server/db/schema"

type CardItemProps = {
  data: CardSelect
  isDragOverlay?: boolean
}

type CardDragState =
  | { type: "idle" }
  | { type: "is-dragging" }
  | { type: "is-over"; closestEdge: Edge | null }

const idleState = { type: "idle" } as const

const CardItemComponent = function CardItem({ data, isDragOverlay = false }: CardItemProps) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const [dragState, setDragState] = useState<CardDragState>(idleState)

  useEffect(() => {
    if (!ref.current || isDragOverlay) return
    const el = ref.current

    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({ type: "card", id: data.id }),
      onDragStart: () => setDragState({ type: "is-dragging" }),
      onDrop: () => setDragState(idleState),
    })

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        return attachClosestEdge(
          { type: "card", id: data.id },
          { input, element, allowedEdges: ["top", "bottom"] },
        )
      },
      canDrop: ({ source }) => {
        if (source.data?.type !== "card") return false
        return source.data.id !== data.id
      },
      onDragEnter: ({ self }) => {
        const closestEdge = extractClosestEdge(self.data)
        setDragState({ type: "is-over", closestEdge })
      },
      onDrag: ({ self }) => {
        const closestEdge = extractClosestEdge(self.data)

        setDragState((current) => {
          if (current.type === "is-over" && current.closestEdge === closestEdge) {
            return current
          }
          return { type: "is-over", closestEdge }
        })
      },
      onDragLeave: ({ source }) => {
        if (source.data?.type === "card" && source.data.id !== data.id) {
          setDragState(idleState)
        }
      },
      onDrop: () => setDragState(idleState),
    })

    return () => {
      cleanupDrag()
      cleanupDrop()
    }
  }, [data.id, isDragOverlay])

  if (isDragOverlay) {
    return (
      <div
        className="cursor-grabbing rounded-lg border-2 border-primary/20 bg-card px-4 py-3 text-sm shadow-xl backdrop-blur-sm"
        aria-hidden="true"
      >
        <div className="line-clamp-3 leading-relaxed font-medium text-foreground">{data.title}</div>
      </div>
    )
  }

  const isDragging = dragState.type === "is-dragging"
  const isOver = dragState.type === "is-over"
  const showIndicatorTop = isOver && dragState.closestEdge === "top"
  const showIndicatorBottom = isOver && dragState.closestEdge === "bottom"

  return (
    <div className="relative">
      {showIndicatorTop && (
        <div className="pointer-events-none absolute -top-px right-0 left-0 z-20 h-0.5 bg-primary">
          <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
        </div>
      )}
      <button
        ref={ref}
        type="button"
        onClick={() => openCardModal(data.id)}
        aria-label={`Card: ${data.title}. Press Enter or Space to open, use arrow keys to move`}
        aria-describedby={`card-${data.id}-description`}
        className={cn(
          "group w-full cursor-grab rounded-lg border border-border/50 bg-card p-4 text-left text-sm transition-all duration-200",
          "hover:border-border hover:bg-muted/50 hover:shadow-md",
          "focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:outline-none",
          "hover:-translate-y-0.5 hover:shadow-lg",
          isDragging && "cursor-grabbing opacity-40 shadow-xl",
        )}
      >
        <div className="space-y-3">
          <div className="line-clamp-4 leading-relaxed font-medium text-foreground transition-colors group-hover:text-primary/90">
            {data.title}
          </div>

          {data.description && (
            <div className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {data.description}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {data.description && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <PhosphorChats className="h-3 w-3" />
                  <span>1</span>
                </div>
              )}

              {data.createdAt && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <PhosphorCalendarBlank className="h-3 w-3" />
                  <span>
                    {new Date(data.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div id={`card-${data.id}-description`} className="sr-only">
          Draggable card. Use mouse to drag or keyboard to navigate and press Enter to open.
        </div>
      </button>
      {showIndicatorBottom && (
        <div className="pointer-events-none absolute right-0 -bottom-px left-0 z-20 h-0.5 bg-primary">
          <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  )
}

export default React.memo(CardItemComponent)
