import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { DotsSixVertical as PhosphorDotsSixVertical } from "@phosphor-icons/react"
import React, { useEffect, useRef, useState, type ComponentRef } from "react"

import type { ListWithCards } from "#/hooks/use-optimistic-board"
import { cn } from "#/lib/utils"

import CardForm from "../card/card-form"
import CardItem from "../card/card-item"
import DroppableArea from "../droppable-area"
import ListHeader from "./list-header"

type ListItemProps = {
  data: ListWithCards
}

type ListDragState =
  | { type: "idle" }
  | { type: "is-dragging" }
  | { type: "is-over"; closestEdge: Edge | null }

const idleState = { type: "idle" } as const

const ListItemComponent = function ListItem({ data }: ListItemProps) {
  const textareaRef = useRef<ComponentRef<"textarea">>(null)
  const [isEditing, setIsEditing] = useState(false)
  const outerRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const dragHandleRef = useRef<HTMLDivElement | null>(null)
  const [dragState, setDragState] = useState<ListDragState>(idleState)

  useEffect(() => {
    const outer = outerRef.current
    const dragHandle = dragHandleRef.current
    if (!outer || !dragHandle) return

    const cleanup = draggable({
      element: dragHandle,
      getInitialData: () => ({ type: "list", id: data.id }),
      onDragStart: () => setDragState({ type: "is-dragging" }),
      onDrop: () => setDragState(idleState),
    })

    const cleanupDrop = dropTargetForElements({
      element: outer,
      getData: ({ input, element }) => {
        return attachClosestEdge(
          { type: "list-item", id: data.id },
          { input, element, allowedEdges: ["left", "right"] },
        )
      },
      canDrop: ({ source }) => {
        return source.data?.type === "list" || source.data?.type === "card"
      },
      onDragEnter: ({ source, self }) => {
        if (source.data?.type !== "list") return
        if (source.data.id === data.id) return

        const closestEdge = extractClosestEdge(self.data)
        setDragState({ type: "is-over", closestEdge })
      },
      onDrag: ({ source, self }) => {
        if (source.data?.type !== "list") return
        if (source.data.id === data.id) return

        const closestEdge = extractClosestEdge(self.data)

        setDragState((current) => {
          if (current.type === "is-over" && current.closestEdge === closestEdge) {
            return current
          }
          return { type: "is-over", closestEdge }
        })
      },
      onDragLeave: ({ source }) => {
        if (source.data?.type === "list") {
          setDragState(idleState)
        }
      },
      onDrop: () => setDragState(idleState),
    })

    return () => {
      cleanup()
      cleanupDrop()
    }
  }, [data.id])

  function disableEditing() {
    setIsEditing(false)
  }

  function enableEditing() {
    setIsEditing(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }

  const isDragging = dragState.type === "is-dragging"
  const isOver = dragState.type === "is-over"
  const showIndicatorLeft = isOver && dragState.closestEdge === "left"
  const showIndicatorRight = isOver && dragState.closestEdge === "right"

  return (
    <div
      ref={outerRef}
      className={cn(
        "group relative w-89 shrink-0 transition-all duration-200 select-none",
        isDragging && "opacity-40",
      )}
    >
      {showIndicatorLeft && (
        <div className="pointer-events-none absolute top-4 bottom-4 -left-2.25 z-20 w-0.5 rounded-full bg-primary shadow-sm" />
      )}
      {showIndicatorRight && (
        <div className="pointer-events-none absolute top-4 -right-2.25 bottom-4 z-20 w-0.5 rounded-full bg-primary shadow-sm" />
      )}

      <div className="flex gap-1">
        <div
          ref={dragHandleRef}
          className={cn(
            "flex w-6 shrink-0 cursor-grab items-start justify-center pt-3",
            isDragging && "cursor-grabbing",
          )}
          aria-label="Drag list"
        >
          <PhosphorDotsSixVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div ref={headerRef} className="w-full rounded-md bg-muted pb-2 shadow-md">
          <div>
            <ListHeader data={data} boardId={data.boardId} />
          </div>

          <DroppableArea
            id={`list-${data.id}`}
            className={cn(
              "mx-1 px-1 py-0.5",
              data.cards && data.cards.length > 0 ? "mt-2" : "mt-0",
            )}
          >
            <div className="flex min-h-5 flex-col gap-y-2">
              {data.cards?.map((card) => (
                <CardItem key={card.id} data={card} />
              ))}
            </div>
          </DroppableArea>

          <CardForm
            listId={data.id}
            boardId={data.boardId}
            ref={textareaRef}
            isEditing={isEditing}
            enableEditing={enableEditing}
            disableEditing={disableEditing}
          />
        </div>
      </div>
    </div>
  )
}

export default React.memo(ListItemComponent)
