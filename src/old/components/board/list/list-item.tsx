"use client";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { type ElementRef, useEffect, useRef, useState } from "react";
import type { ListWithCards } from "~/hooks/use-optimistic-board";
import { cn } from "~/lib/utils";

import CardForm from "../../forms/card-form";
import { CardItem } from "../card/card-item";
import { DroppableArea } from "../droppable-area";
import { ListHeader } from "./list-header";

type ListItemProps = {
  data: ListWithCards;
};

export function ListItem({ data }: ListItemProps) {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({ type: "list", id: data.id }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({ type: "list-item", id: data.id }),
    });
    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [data.id]);

  function disableEditing() {
    setIsEditing(false);
  }

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  }

  return (
    <div
      ref={ref}
      className={cn(
        "h-full w-[272px] shrink-0 select-none",
        isDragging && "opacity-50",
      )}
    >
      <div className="w-full rounded-md bg-muted pb-2 shadow-md">
        <div>
          <ListHeader onAddCard={enableEditing} data={data} />
        </div>

        <DroppableArea
          id={`list-${data.id}`}
          className={cn(
            "mx-1 px-1 py-0.5",
            data.cards && data.cards.length > 0 ? "mt-2" : "mt-0",
          )}
        >
          <div className="flex min-h-[20px] flex-col gap-y-2">
            {data.cards?.map((card) => (
              <CardItem key={card.id} data={card} />
            ))}
          </div>
        </DroppableArea>

        <CardForm
          listId={data.id}
          ref={textareaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </div>
  );
}
