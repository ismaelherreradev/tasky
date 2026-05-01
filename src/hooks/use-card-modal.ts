import { atom } from "jotai"

export type CardModalState = {
  id: number | null
  isOpen: boolean
}

export const cardModalAtom = atom<CardModalState>({
  id: null,
  isOpen: false,
})

export const onOpenAtom = atom(
  (get) => get(cardModalAtom),
  (get, set, update: { id: number }) => {
    set(cardModalAtom, { id: update.id, isOpen: true })
  },
)

export function openCardModal(cardId: number) {
  return {
    type: "open" as const,
    id: cardId,
  }
}

export function closeCardModal() {
  return {
    type: "close" as const,
  }
}