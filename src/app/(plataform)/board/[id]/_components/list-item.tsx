"use client";

import { useRef, useState, type ElementRef } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import type { CardSelect, ListSelect } from "~/server/db/schema";

import { cn } from "~/lib/utils";

import { CardForm } from "./card-form";
import CardItem from "./card-item";
import { ListHeader } from "./list-header";

export type ListWithCards = ListSelect & { cards: CardSelect[] };

type ListItemProps = {
  index: number;
  data: ListWithCards;
};

export function ListItem({ index, data }: ListItemProps) {
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);

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
    <Draggable draggableId={String(data.id)} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full w-[272px] shrink-0 select-none"
        >
          <div {...provided.dragHandleProps} className="w-full rounded-md bg-muted pb-2 shadow-md">
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={String(data.id)} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 flex flex-col gap-y-2 px-1 py-0.5",
                    data.cards.length > 0 ? "mt-2" : "mt-0",
                  )}
                >
                  {data.cards.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}
