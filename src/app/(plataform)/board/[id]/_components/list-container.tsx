"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import type { CardSelect, ListSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { toast } from "sonner";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

export type ListWithCards = ListSelect & { cards: CardSelect[] };

type ListContainerProps = {
  boardId: number;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed!);

  return result;
}

export function ListContainer({ boardId }: ListContainerProps) {
  const {
    data: list,
    isLoading,
    isError,
  } = api.list.getlistsWithCards.useQuery({
    boardId: boardId,
  });
  const [orderedList, setOrderedList] = useState<ListWithCards[]>([]);

  useEffect(() => {
    if (list) {
      setOrderedList(list as ListWithCards[]);
    }
  }, [list]);

  const updateListOrder = api.list.updateListOrder.useMutation({
    onSuccess: async () => {
      toast.success("List reordered");
    },
  });

  const updateCardOrder = api.card.updateCardOrder.useMutation({
    onSuccess: async () => {
      toast.success("Card reordered");
    },
  });

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, type } = result;

      if (!destination) {
        return;
      }

      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }

      if (type === "list") {
        const items = reorder(orderedList, source.index, destination.index).map((item, index) => ({
          ...item,
          order: index,
        }));

        setOrderedList(items);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updateListOrder.mutate({ items });
      }

      if (type === "card") {
        const newOrderedList = [...orderedList];
        const sourceList = newOrderedList.find((list) => list.id === Number(source.droppableId));
        const destList = newOrderedList.find((list) => list.id === Number(destination.droppableId));

        if (!sourceList || !destList) {
          return;
        }

        if (!sourceList.cards) {
          sourceList.cards = [];
        }

        if (!destList.cards) {
          destList.cards = [];
        }

        if (source.droppableId === destination.droppableId) {
          const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

          reorderedCards.forEach((card, idx) => {
            card.order = idx;
          });

          sourceList.cards = reorderedCards;

          setOrderedList(newOrderedList);
          updateCardOrder.mutate({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            items: reorderedCards,
          });
        } else {
          const [movedCard] = sourceList.cards.splice(source.index, 1);
          movedCard!.listId = Number(destination.droppableId);
          destList.cards.splice(destination.index, 0, movedCard!);

          sourceList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          destList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          setOrderedList(newOrderedList);
          updateCardOrder.mutate({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            items: destList.cards,
          });
        }
      }
    },
    [orderedList, updateListOrder, updateCardOrder],
  );

  const memoizedListItems = useMemo(() => {
    return orderedList.map((list, index) => <ListItem key={list.id} index={index} data={list} />);
  }, [orderedList]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading lists</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol {...provided.droppableProps} ref={provided.innerRef} className="flex h-full gap-x-3">
            {memoizedListItems}
            {provided.placeholder}
            <ListForm />
            <div className="w-1 shrink-0" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
