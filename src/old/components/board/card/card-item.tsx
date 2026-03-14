"use client";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useAtom } from "jotai";
import { Calendar, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { onOpenAtom } from "~/hooks/use-card-modal";

import { cn } from "~/lib/utils";
import type { CardSelect } from "~/server/db/schema";

type CardItemProps = {
  data: CardSelect;
  isDragOverlay?: boolean;
};

export function CardItem({ data, isDragOverlay = false }: CardItemProps) {
  const [, onOpen] = useAtom(onOpenAtom);
  const ref = useRef<HTMLButtonElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!ref.current || isDragOverlay) return;
    const el = ref.current;
    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => ({ type: "card", id: data.id }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: () => ({ type: "card", id: data.id }),
    });
    return () => {
      cleanupDrag();
      cleanupDrop();
    };
  }, [data.id, isDragOverlay]);

  if (isDragOverlay) {
    return (
      <div
        className="rotate-2 transform cursor-grabbing rounded-lg border-2 border-primary/20 bg-card px-4 py-3 text-sm shadow-xl backdrop-blur-sm"
        aria-hidden="true"
      >
        <div className="line-clamp-3 font-medium text-foreground leading-relaxed">
          {data.title}
        </div>
      </div>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(data.id)}
      aria-label={`Card: ${data.title}. Press Enter or Space to open, use arrow keys to move`}
      aria-describedby={`card-${data.id}-description`}
      className={cn(
        "group w-full cursor-grab rounded-lg border border-border/50 bg-card p-4 text-left text-sm transition-all duration-200 hover:border-border hover:bg-card/90 hover:shadow-md",
        "focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
        "hover:-translate-y-0.5 hover:shadow-lg",
        isDragging && "rotate-1 scale-105 cursor-grabbing opacity-60 shadow-xl",
      )}
    >
      <div className="space-y-3">
        <div className="line-clamp-4 font-medium text-foreground leading-relaxed transition-colors group-hover:text-primary/90">
          {data.title}
        </div>

        {data.description && (
          <div className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
            {data.description}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {data.description && (
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <MessageSquare className="h-3 w-3" />
                <span>1</span>
              </div>
            )}

            {data.createdAt && (
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Calendar className="h-3 w-3" />
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
        Draggable card. Use mouse to drag or keyboard to navigate and press
        Enter to open.
      </div>
    </button>
  );
}

export default CardItem;
