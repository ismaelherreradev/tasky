"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { CardSelect, ListSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

export type ListWithCards = ListSelect & { cards: CardSelect[] };

type ListContainerProps = {
  boardId: number;
};

export function ListContainer({ boardId }: ListContainerProps) {
  const [list] = api.list.getlistsWithCards.useSuspenseQuery({ boardId: boardId });

  function onDragEnd() {
    console.log("hi");
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol {...provided.droppableProps} ref={provided.innerRef} className="flex h-full gap-x-3">
            {list?.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="w-1 shrink-0" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
