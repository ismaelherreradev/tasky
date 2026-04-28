"use client";

import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOptimisticBoard } from "~/hooks/use-optimistic-board";
import type { CardSelect } from "~/server/db/schema";

import { ListForm } from "../forms/list-form";
import { ListItem } from "./list/list-item";

type DragData =
  | { type: "list"; id: number | string }
  | { type: "list-item"; id: number }
  | { type: "card"; id: number }
  | { type: "list-container" };

type ActiveDragData = { type: "list" | "card"; id: number };

const isActiveDragData = (v: unknown): v is ActiveDragData => {
  if (!v || typeof v !== "object") return false;
  const d = v as { type?: unknown; id?: unknown };
  return (d.type === "list" || d.type === "card") && typeof d.id === "number";
};

const isDragData = (v: unknown): v is DragData => {
  if (!v || typeof v !== "object") return false;
  const d = v as { type?: unknown; id?: unknown };
  return (
    d.type === "list" ||
    d.type === "card" ||
    d.type === "list-item" ||
    d.type === "list-container"
  );
};

type ListContainerProps = {
  boardId: number;
};

export function ListContainer({ boardId: _boardId }: ListContainerProps) {
  const { lists, isLoading, isError, moveCard, moveList } =
    useOptimisticBoard();

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isOverContainer, setIsOverContainer] = useState(false);

  const findCardById = useCallback(
    (id: number): (CardSelect & { listId: number }) | null => {
      if (!lists?.length) return null;
      for (const list of lists) {
        const card = list.cards?.find((card) => card.id === id);
        if (card) {
          return { ...card, listId: list.id } as CardSelect & {
            listId: number;
          };
        }
      }
      return null;
    },
    [lists],
  );

  useEffect(() => {
    const cleanupMonitor = monitorForElements({
      onDrop(args) {
        const { source, location } = args as {
          source: { data: unknown };
          location: {
            current: { dropTargets: Array<{ data: unknown }> } | null;
          };
        };
        if (!isActiveDragData(source.data)) return;
        const activeType = source.data.type;
        const activeId = source.data.id;
        const targets = location.current?.dropTargets ?? [];
        let overData: DragData | undefined;
        if (targets.length) {
          if (activeType === "list") {
            for (let i = targets.length - 1; i >= 0; i--) {
              const d = targets[i]?.data;
              if (isDragData(d) && d.type === "list-item") {
                overData = d;
                break;
              }
            }
          } else if (activeType === "card") {
            for (let i = targets.length - 1; i >= 0; i--) {
              const d = targets[i]?.data;
              if (isDragData(d) && (d.type === "card" || d.type === "list")) {
                overData = d;
                break;
              }
            }
          }
          if (!overData) {
            const d = targets[targets.length - 1]?.data;
            if (isDragData(d)) {
              overData = d;
            }
          }
        }
        if (!activeType || activeId == null || !overData) return;

        if (activeType === "list" && overData.type === "list-item") {
          const fromIndex = lists.findIndex((l) => l.id === activeId);
          const toIndex = lists.findIndex((l) => l.id === overData.id);
          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            moveList(activeId, fromIndex, toIndex);
          }
          return;
        }

        if (activeType === "card") {
          if (overData.type === "list") {
            const activeCard = findCardById(activeId);
            const overListId = Number(
              typeof overData.id === "string"
                ? String(overData.id).replace("list-", "")
                : overData.id,
            );
            if (!activeCard || activeCard.listId === overListId) return;
            const activeListIndex = lists.findIndex(
              (l) => l.id === activeCard.listId,
            );
            const overList = lists.find((l) => l.id === overListId);
            if (activeListIndex === -1 || !overList) return;
            const activeCardIndex =
              lists[activeListIndex]?.cards?.findIndex(
                (c) => c.id === activeId,
              ) ?? -1;
            if (activeCardIndex === -1) return;
            moveCard(
              activeId,
              activeCard.listId,
              overListId,
              activeCardIndex,
              overList.cards?.length ?? 0,
            );
            return;
          }

          if (overData.type === "card") {
            const activeCard = findCardById(activeId);
            const overCard = findCardById(overData.id);
            if (!activeCard || !overCard) return;

            if (activeCard.listId === overCard.listId) {
              const listIndex = lists.findIndex(
                (l) => l.id === activeCard.listId,
              );
              if (listIndex === -1) return;
              const fromIndex =
                lists[listIndex]?.cards?.findIndex((c) => c.id === activeId) ??
                -1;
              const toIndex =
                lists[listIndex]?.cards?.findIndex(
                  (c) => c.id === overCard.id,
                ) ?? -1;
              if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                moveCard(
                  activeId,
                  activeCard.listId,
                  activeCard.listId,
                  fromIndex,
                  toIndex,
                );
              }
            } else {
              const fromListIndex = lists.findIndex(
                (l) => l.id === activeCard.listId,
              );
              const toListIndex = lists.findIndex(
                (l) => l.id === overCard.listId,
              );
              if (fromListIndex === -1 || toListIndex === -1) return;
              const fromIndex =
                lists[fromListIndex]?.cards?.findIndex(
                  (c) => c.id === activeId,
                ) ?? -1;
              const toIndex =
                lists[toListIndex]?.cards?.findIndex(
                  (c) => c.id === overCard.id,
                ) ?? -1;
              if (fromIndex === -1 || toIndex === -1) return;
              moveCard(
                activeId,
                activeCard.listId,
                overCard.listId,
                fromIndex,
                toIndex,
              );
            }
          }
        }
      },
    });
    let cleanupDrop: (() => void) | undefined;
    if (scrollerRef.current) {
      cleanupDrop = dropTargetForElements({
        element: scrollerRef.current,
        getData: () => ({ type: "list-container" }),
        onDragEnter: () => setIsOverContainer(true),
        onDragLeave: () => setIsOverContainer(false),
        onDrop: () => setIsOverContainer(false),
      });
    }
    return () => {
      cleanupMonitor();
      cleanupDrop?.();
    };
  }, [lists, moveCard, moveList, findCardById]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading board</div>;

  if (!lists?.length) {
    return (
      <div className="relative h-full w-full">
        <div
          className="flex h-full gap-x-4 overflow-x-auto overflow-y-hidden px-1 pb-6"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "hsl(var(--border)) transparent",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: hsl(var(--muted) / 0.3);
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: hsl(var(--border));
              border-radius: 4px;
              transition: background-color 0.2s ease;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: hsl(var(--muted-foreground) / 0.6);
            }
          `}</style>

          <ListForm />
          <div className="w-4 shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div
        ref={scrollerRef}
        className={`flex h-full gap-x-4 overflow-x-auto overflow-y-hidden px-3 pb-7 ${isOverContainer ? "ring-2 ring-primary/40 ring-offset-2" : ""} board-scroll`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "hsl(var(--border)) transparent",
        }}
      >
        <style jsx>{`
          .board-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .board-scroll::-webkit-scrollbar-track {
            background: hsl(var(--muted) / 0.3);
            border-radius: 4px;
          }
          .board-scroll::-webkit-scrollbar-thumb {
            background: hsl(var(--border));
            border-radius: 4px;
            transition: background-color 0.2s ease;
          }
          .board-scroll::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--muted-foreground) / 0.6);
          }
        `}</style>
        {lists.map((list) => (
          <ListItem key={list.id} data={list} />
        ))}

        <ListForm />
        <div className="w-6 shrink-0" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/80 to-transparent"
      />
    </div>
  );
}
