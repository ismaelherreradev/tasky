import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { TRPCClientError } from "@trpc/client"
import { createContext, useCallback, useContext, useMemo } from "react"

import { toastManager } from "#/components/ui/toast"
import type { CardSelect, ListSelect } from "#/db/schema"
import { useTRPC } from "#/integrations/trpc/react"

export type ListWithCards = ListSelect & { cards: CardSelect[] }

interface OptimisticBoardContextType {
  lists: ListWithCards[]
  isLoading: boolean
  isError: boolean
  moveCard: (
    cardId: number,
    sourceListId: number,
    destListId: number,
    sourceIndex: number,
    destIndex: number,
  ) => void
  moveList: (listId: number, sourceIndex: number, destIndex: number) => void
  refetch: () => void
}

const OptimisticBoardContext = createContext<OptimisticBoardContextType | undefined>(undefined)

interface OptimisticBoardProviderProps {
  children: React.ReactNode
  boardId: number
}

export function OptimisticBoardProvider({ children, boardId }: OptimisticBoardProviderProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const {
    data: lists,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    ...trpc.list.getlistsWithCards.queryOptions({
      boardId: boardId,
    }),
  })

  const updateListOrderMutation = useMutation({
    ...trpc.list.updateListOrder.mutationOptions(),
    onSuccess: () => {
      toastManager.add({ title: "Success", description: "List reordered" })
    },
    onError: (error) => {
      const message =
        error instanceof TRPCClientError
          ? error.message
          : "Failed to reorder list. Please try again."

      toastManager.add({ title: "Error", description: message })
      void queryClient.invalidateQueries({
        queryKey: trpc.list.getlistsWithCards.queryKey({ boardId }),
      })
    },
  })

  const updateCardOrderMutation = useMutation({
    ...trpc.card.updateCardOrder.mutationOptions(),
    onSuccess: () => {
      toastManager.add({ title: "Success", description: "Card reordered" })
    },
    onError: (error) => {
      const message =
        error instanceof TRPCClientError
          ? error.message
          : "Failed to reorder card. Please try again."

      toastManager.add({ title: "Error", description: message })
      void queryClient.invalidateQueries({
        queryKey: trpc.list.getlistsWithCards.queryKey({ boardId }),
      })
    },
  })

  const moveCard = useCallback(
    (
      _cardId: number,
      sourceListId: number,
      destListId: number,
      sourceIndex: number,
      destIndex: number,
    ) => {
      if (!lists) return

      queryClient.setQueryData(trpc.list.getlistsWithCards.queryKey({ boardId }), (old) => {
        if (!old) return old

        const newLists = [...old]

        const sourceListIndex = newLists.findIndex((list) => list.id === sourceListId)
        const destListIndex = newLists.findIndex((list) => list.id === destListId)

        if (sourceListIndex === -1 || destListIndex === -1) return old

        const sourceListItem = newLists[sourceListIndex]
        const destListItem = newLists[destListIndex]

        if (!sourceListItem || !destListItem) return old

        const sourceList: ListWithCards = {
          ...sourceListItem,
          cards: [...(sourceListItem.cards ?? [])],
        }
        const destList: ListWithCards =
          sourceListIndex === destListIndex
            ? sourceList
            : {
                ...destListItem,
                cards: [...(destListItem.cards ?? [])],
              }

        const sourceCards = sourceList.cards
        const destCards = destList.cards

        const originalCard = sourceCards[sourceIndex]
        if (!originalCard) return old

        const movedCard = { ...originalCard }
        sourceCards.splice(sourceIndex, 1)

        if (sourceListId !== destListId) {
          movedCard.listId = destListId
        }

        destCards.splice(destIndex, 0, movedCard)

        if (sourceListIndex === destListIndex) {
          destCards.forEach((card, index) => {
            card.order = index
          })
          newLists[sourceListIndex] = {
            ...sourceList,
            cards: destCards,
          } as ListWithCards
        } else {
          sourceCards.forEach((card, index) => {
            card.order = index
          })
          destCards.forEach((card, index) => {
            card.order = index
          })
          newLists[sourceListIndex] = {
            ...sourceList,
            cards: sourceCards,
          } as ListWithCards
          newLists[destListIndex] = {
            ...destList,
            cards: destCards,
          } as ListWithCards
        }

        return newLists
      })

      const updatedCacheData = queryClient.getQueryData(
        trpc.list.getlistsWithCards.queryKey({ boardId }),
      )
      if (updatedCacheData) {
        const allAffectedCards: Array<{
          id: number
          title: string
          order: number
          listId: number
        }> = []

        if (sourceListId === destListId) {
          const updatedList = updatedCacheData.find((list) => list.id === destListId)
          if (updatedList?.cards) {
            allAffectedCards.push(
              ...updatedList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            )
          }
        } else {
          const updatedSourceList = updatedCacheData.find((list) => list.id === sourceListId)
          const updatedDestList = updatedCacheData.find((list) => list.id === destListId)

          if (updatedSourceList?.cards) {
            allAffectedCards.push(
              ...updatedSourceList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            )
          }

          if (updatedDestList?.cards) {
            allAffectedCards.push(
              ...updatedDestList.cards.map((card) => ({
                id: card.id,
                title: card.title,
                order: card.order,
                listId: card.listId,
              })),
            )
          }
        }

        if (allAffectedCards.length > 0) {
          updateCardOrderMutation.mutate({
            items: allAffectedCards as [
              { id: number; title: string; order: number; listId: number },
              ...{ id: number; title: string; order: number; listId: number }[],
            ],
          })
        }
      }
    },
    [lists, boardId, trpc, queryClient, updateCardOrderMutation],
  )

  const moveList = useCallback(
    (_listId: number, sourceIndex: number, destIndex: number) => {
      if (!lists) return

      queryClient.setQueryData(trpc.list.getlistsWithCards.queryKey({ boardId }), (old) => {
        if (!old) return old

        const newLists = [...old]
        const [movedList] = newLists.splice(sourceIndex, 1)
        if (!movedList) return old

        newLists.splice(destIndex, 0, movedList)

        return newLists.map((list, index) => ({
          ...list,
          order: index,
        }))
      })

      const reorderedLists = [...lists]
      const [movedList] = reorderedLists.splice(sourceIndex, 1)
      if (movedList) {
        reorderedLists.splice(destIndex, 0, movedList)
        const updatedLists = reorderedLists.map((list, index) => ({
          ...list,
          order: index,
        }))

        if (updatedLists.length > 0) {
          updateListOrderMutation.mutate({
            items: updatedLists.map((list) => ({
              id: list.id,
              title: list.title,
              order: list.order,
            })) as [
              { id: number; title: string; order: number },
              ...{ id: number; title: string; order: number }[],
            ],
          })
        }
      }
    },
    [lists, boardId, trpc, queryClient, updateListOrderMutation],
  )

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
  )

  return <OptimisticBoardContext.Provider value={value}>{children}</OptimisticBoardContext.Provider>
}

export function useOptimisticBoard() {
  const context = useContext(OptimisticBoardContext)
  if (context === undefined) {
    throw new Error("useOptimisticBoard must be used within an OptimisticBoardProvider")
  }
  return context
}
