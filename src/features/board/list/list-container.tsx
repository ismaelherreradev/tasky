import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { useEffect, useRef, useState } from "react"

import { useOptimisticBoard, type ListWithCards } from "#/hooks/use-optimistic-board"
import { cn } from "#/lib/utils"
import type { CardSelect } from "#/server/db/schema"

import ListForm from "./list-form"
import ListItem from "./list-item"

type DragData =
  | { type: "list"; id: number | string }
  | { type: "list-item"; id: number }
  | { type: "card"; id: number }
  | { type: "list-container" }

type ActiveDragData = { type: "list" | "card"; id: number }

const isActiveDragData = (v: unknown): v is ActiveDragData => {
  if (!v || typeof v !== "object") return false
  const d = v as { type?: unknown; id?: unknown }
  return (d.type === "list" || d.type === "card") && typeof d.id === "number"
}

const isDragData = (v: unknown): v is DragData => {
  if (!v || typeof v !== "object") return false
  const d = v as { type?: unknown; id?: unknown }
  return (
    d.type === "list" || d.type === "card" || d.type === "list-item" || d.type === "list-container"
  )
}

type ListContainerProps = {
  boardId: number
}

function findCardByIdFromLists(
  lists: ListWithCards[],
  id: number,
): (CardSelect & { listId: number }) | null {
  if (!lists || !Array.isArray(lists)) return null
  for (const list of lists) {
    const cards = list.cards
    const card = cards?.find((c) => c.id === id)
    if (card) {
      return { ...card, listId: list.id } as CardSelect & { listId: number }
    }
  }
  return null
}

function getReorderDestinationIndex(
  sourceIndex: number,
  targetIndex: number,
  closestEdge: string | null,
  axis: "horizontal" | "vertical",
) {
  if (sourceIndex === targetIndex) return sourceIndex
  if (axis === "horizontal") {
    if (sourceIndex < targetIndex) {
      return closestEdge === "right" ? targetIndex : targetIndex - 1
    } else {
      return closestEdge === "right" ? targetIndex + 1 : targetIndex
    }
  } else {
    if (sourceIndex < targetIndex) {
      return closestEdge === "bottom" ? targetIndex : targetIndex - 1
    } else {
      return closestEdge === "bottom" ? targetIndex + 1 : targetIndex
    }
  }
}

export function ListContainer({ boardId: _boardId }: ListContainerProps) {
  const { lists, isLoading, isError, moveCard, moveList } = useOptimisticBoard()

  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [isOverContainer, setIsOverContainer] = useState(false)

  const listsRef = useRef(lists)
  const moveCardRef = useRef(moveCard)
  const moveListRef = useRef(moveList)

  listsRef.current = lists
  moveCardRef.current = moveCard
  moveListRef.current = moveList

  useEffect(() => {
    const cleanupMonitor = monitorForElements({
      onDrop(args) {
        const { source, location } = args as {
          source: { data: unknown }
          location: {
            current: { dropTargets: Array<{ data: unknown }> } | null
          }
        }
        if (!isActiveDragData(source.data)) return
        const activeType = source.data.type
        const activeId = source.data.id
        const targets = location.current?.dropTargets ?? []
        let overData: DragData | undefined
        if (targets.length) {
          if (activeType === "list") {
            for (let i = targets.length - 1; i >= 0; i--) {
              const d = targets[i]?.data
              if (isDragData(d) && d.type === "list-item") {
                overData = d
                break
              }
            }
          } else if (activeType === "card") {
            for (let i = targets.length - 1; i >= 0; i--) {
              const d = targets[i]?.data
              if (isDragData(d) && (d.type === "card" || d.type === "list")) {
                overData = d
                break
              }
            }
          }
          if (!overData) {
            const d = targets[targets.length - 1]?.data
            if (isDragData(d)) {
              overData = d
            }
          }
        }
        if (!activeType || activeId == null || !overData) return

        const currentLists = listsRef.current

        if (activeType === "list" && overData.type === "list-item") {
          const fromIndex = currentLists.findIndex((l) => l.id === activeId)
          const overIndex = currentLists.findIndex((l) => l.id === overData.id)
          const closestEdge = extractClosestEdge(overData)

          if (fromIndex !== -1 && overIndex !== -1) {
            const toIndex = getReorderDestinationIndex(
              fromIndex,
              overIndex,
              closestEdge,
              "horizontal",
            )
            if (fromIndex !== toIndex) {
              moveListRef.current(activeId, fromIndex, toIndex)
            }
          }
          return
        }

        if (activeType === "card") {
          if (overData.type === "list") {
            const activeCard = findCardByIdFromLists(currentLists, activeId)
            const overListId = Number(
              typeof overData.id === "string"
                ? String(overData.id).replace("list-", "")
                : overData.id,
            )
            if (!activeCard || activeCard.listId === overListId) return
            const activeListIndex = currentLists.findIndex((l) => l.id === activeCard.listId)
            const overList = currentLists.find((l) => l.id === overListId)
            if (activeListIndex === -1 || !overList) return
            const activeCardIndex =
              currentLists[activeListIndex]?.cards?.findIndex((c) => c.id === activeId) ?? -1
            if (activeCardIndex === -1) return
            moveCardRef.current(
              activeId,
              activeCard.listId,
              overListId,
              activeCardIndex,
              overList.cards?.length ?? 0,
            )
            return
          }

          if (overData.type === "card") {
            const activeCard = findCardByIdFromLists(currentLists, activeId)
            const overCard = findCardByIdFromLists(currentLists, overData.id)
            if (!activeCard || !overCard) return

            const closestEdge = extractClosestEdge(overData)

            if (activeCard.listId === overCard.listId) {
              const listIndex = currentLists.findIndex((l) => l.id === activeCard.listId)
              if (listIndex === -1) return
              const fromIndex =
                currentLists[listIndex]?.cards?.findIndex((c) => c.id === activeId) ?? -1
              const overIndex =
                currentLists[listIndex]?.cards?.findIndex((c) => c.id === overCard.id) ?? -1

              if (fromIndex !== -1 && overIndex !== -1) {
                const toIndex = getReorderDestinationIndex(
                  fromIndex,
                  overIndex,
                  closestEdge,
                  "vertical",
                )
                if (fromIndex !== toIndex) {
                  moveCardRef.current(
                    activeId,
                    activeCard.listId,
                    activeCard.listId,
                    fromIndex,
                    toIndex,
                  )
                }
              }
            } else {
              const fromListIndex = currentLists.findIndex((l) => l.id === activeCard.listId)
              const toListIndex = currentLists.findIndex((l) => l.id === overCard.listId)
              if (fromListIndex === -1 || toListIndex === -1) return
              const fromIndex =
                currentLists[fromListIndex]?.cards?.findIndex((c) => c.id === activeId) ?? -1
              const overIndex =
                currentLists[toListIndex]?.cards?.findIndex((c) => c.id === overCard.id) ?? -1
              if (fromIndex === -1 || overIndex === -1) return

              const toIndex = closestEdge === "bottom" ? overIndex + 1 : overIndex

              moveCardRef.current(activeId, activeCard.listId, overCard.listId, fromIndex, toIndex)
            }
          }
        }
      },
    })
    let cleanupDrop: (() => void) | undefined
    if (scrollerRef.current) {
      cleanupDrop = dropTargetForElements({
        element: scrollerRef.current,
        getData: () => ({ type: "list-container" }),
        onDragEnter: () => setIsOverContainer(true),
        onDragLeave: () => {
          setIsOverContainer(false)
        },
        onDrop: () => {
          setIsOverContainer(false)
        },
      })
    }
    return () => {
      cleanupMonitor()
      cleanupDrop?.()
    }
  }, [])

  if (isLoading) return <div className="p-4">Loading...</div>
  if (isError) return <div className="p-4 text-red-500">Error loading board</div>

  if (!lists?.length) {
    return (
      <div className="h-full w-full overflow-x-auto overflow-y-hidden">
        <div className="flex h-full items-start gap-x-4 px-4 pt-2 pb-4">
          <ListForm boardId={_boardId} />
          <div className="w-4 shrink-0" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden">
      <div
        ref={scrollerRef}
        className={cn(
          "flex h-full items-start gap-x-4 px-4 pt-2 pb-4",
          isOverContainer && "ring-2 ring-primary/40 ring-offset-2",
        )}
      >
        {lists.map((list) => (
          <ListItem key={list.id} data={list} />
        ))}

        <ListForm boardId={_boardId} />
        <div className="w-6 shrink-0" />
      </div>
    </div>
  )
}
