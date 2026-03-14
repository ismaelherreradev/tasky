"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { toast } from "sonner";
import type { CardSelect, ListSelect } from "~/server/db/schema";
import { api } from "~/trpc/react";

export type ListWithCards = ListSelect & { cards: CardSelect[] };

interface OptimisticBoardContextType {
  lists: ListWithCards[];
  isLoading: boolean;
  isError: boolean;
  moveCard: (
    cardId: number,
    sourceListId: number,
    destListId: number,
    sourceIndex: number,
    destIndex: number,
  ) => void;
  moveList: (listId: number, sourceIndex: number, destIndex: number) => void;
  refetch: () => void;
}

const OptimisticBoardContext = createContext<
  OptimisticBoardContextType | undefined
>(undefined);

interface OptimisticBoardProviderProps {
  children: React.ReactNode;
  boardId: number;
}

export function OptimisticBoardProvider({
  children,
  boardId,
}: OptimisticBoardProviderProps) {
  const {
    data: lists,
    isLoading,
    isError,
    refetch,
  } = api.list.getlistsWithCards.useQuery({
    boardId: boardId,
  });

  const utils = api.useUtils();

  const updateListOrderMutation = api.list.updateListOrder.useMutation({
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: () => {
      toast.error("Failed to reorder list");
      void utils.list.getlistsWithCards.invalidate({ boardId });
    },
  });

  const updateCardOrderMutation = api.card.updateCardOrder.useMutation({
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: () => {
      toast.error("Failed to reorder card");
      void utils.list.getlistsWithCards.invalidate({ boardId });
    },
  });

  // Create stable references for mutations
  const updateCardOrderRef = useRef(updateCardOrderMutation.mutate);
  const updateListOrderRef = useRef(updateListOrderMutation.mutate);

  // Update refs when mutations change
  updateCardOrderRef.current = updateCardOrderMutation.mutate;
  updateListOrderRef.current = updateListOrderMutation.mutate;

  const moveCard = useCallback(
    (
      _cardId: number,
      sourceListId: number,
      destListId: number,
      sourceIndex: number,
      destIndex: number,
    ) => {
      if (!lists) return;

      utils.list.getlistsWithCards.setData({ boardId }, (old) => {
        if (!old) return old;

        const newLists = [...old];

        const sourceListIndex = newLists.findIndex(
          (list) => list.id === sourceListId,
        );
        const destListIndex = newLists.findIndex(
          (list) => list.id === destListId,
        );

        if (sourceListIndex === -1 || destListIndex === -1) return old;

        const sourceListItem = newLists[sourceListIndex];
        const destListItem = newLists[destListIndex];

        if (!sourceListItem || !destListItem) return old;

        const sourceList: ListWithCards = {
          ...sourceListItem,
          cards: [...(sourceListItem.cards ?? [])],
        };
        const destList: ListWithCards =
          sourceListIndex === destListIndex
            ? sourceList
            : {
                ...destListItem,
                cards: [...(destListItem.cards ?? [])],
              };

        const sourceCards = sourceList.cards;
        const destCards = destList.cards;

        const originalCard = sourceCards[sourceIndex];
        if (!originalCard) return old;

        const movedCard = { ...originalCard };
        sourceCards.splice(sourceIndex, 1);

        if (sourceListId !== destListId) {
          movedCard.listId = destListId;
        }

        destCards.splice(destIndex, 0, movedCard);

        if (sourceListIndex === destListIndex) {
          destCards.forEach((card, index) => {
            card.order = index;
          });
          newLists[sourceListIndex] = {
            ...sourceList,
            cards: destCards,
          } as ListWithCards;
        } else {
          sourceCards.forEach((card, index) => {
            card.order = index;
          });
          destCards.forEach((card, index) => {
            card.order = index;
          });
          newLists[sourceListIndex] = {
            ...sourceList,
            cards: sourceCards,
          } as ListWithCards;
          newLists[destListIndex] = {
            ...destList,
            cards: destCards,
          } as ListWithCards;
        }

        return newLists;
      });

      const updatedCacheData = utils.list.getlistsWithCards.getData({
        boardId,
      });
      if (updatedCacheData) {
        const allAffectedCards: Array<{
          id: number;
          title: string;
          order: number;
          listId: number;
        }> = [];

        if (sourceListId === destListId) {
          const updatedList = updatedCacheData.find(
            (list) => list.id === destListId,
          );
          if (updatedList?.cards) {
            allAffectedCards.push(
              ...updatedList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            );
          }
        } else {
          const updatedSourceList = updatedCacheData.find(
            (list) => list.id === sourceListId,
          );
          const updatedDestList = updatedCacheData.find(
            (list) => list.id === destListId,
          );

          if (updatedSourceList?.cards) {
            allAffectedCards.push(
              ...updatedSourceList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            );
          }

          if (updatedDestList?.cards) {
            allAffectedCards.push(
              ...updatedDestList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            );
          }
        }

        if (allAffectedCards.length > 0) {
          updateCardOrderRef.current({
            items: allAffectedCards as [
              { id: number; title: string; order: number; listId: number },
              ...{ id: number; title: string; order: number; listId: number }[],
            ],
          });
        }
      }
    },
    [lists, boardId, utils],
  );

  const moveList = useCallback(
    (_listId: number, sourceIndex: number, destIndex: number) => {
      if (!lists) return;

      utils.list.getlistsWithCards.setData({ boardId }, (old) => {
        if (!old) return old;

        const newLists = [...old];
        const [movedList] = newLists.splice(sourceIndex, 1);
        if (!movedList) return old;

        newLists.splice(destIndex, 0, movedList);

        return newLists.map((list, index) => ({
          ...list,
          order: index,
        }));
      });

      const reorderedLists = [...lists];
      const [movedList] = reorderedLists.splice(sourceIndex, 1);
      if (movedList) {
        reorderedLists.splice(destIndex, 0, movedList);
        const updatedLists = reorderedLists.map((list, index) => ({
          ...list,
          order: index,
        }));

        if (updatedLists.length > 0) {
          updateListOrderRef.current({
            items: updatedLists.map((list) => ({
              id: list.id,
              title: list.title,
              order: list.order,
            })) as [
              { id: number; title: string; order: number },
              ...{ id: number; title: string; order: number }[],
            ],
          });
        }
      }
    },
    [lists, boardId, utils],
  );

  const value = useMemo(
    () => ({
      lists: lists ?? [],
      isLoading,
      isError,
      moveCard,
      moveList,
      refetch,
    }),
    [lists, isLoading, isError, moveCard, moveList, refetch],
  );

  return (
    <OptimisticBoardContext.Provider value={value}>
      {children}
    </OptimisticBoardContext.Provider>
  );
}

export function useOptimisticBoard() {
  const context = useContext(OptimisticBoardContext);
  if (context === undefined) {
    throw new Error(
      "useOptimisticBoard must be used within an OptimisticBoardProvider",
    );
  }
  return context;
}
