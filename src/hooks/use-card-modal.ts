import { create } from "zustand"

export type CardModalState = {
  id: number | null
  isOpen: boolean
}

type CardModalStore = {
  state: CardModalState
  open: (id: number) => void
  close: () => void
}

export const useCardModalStore = create<CardModalStore>((set) => ({
  state: {
    id: null,
    isOpen: false,
  },
  open: (id) => set({ state: { id, isOpen: true } }),
  close: () => set({ state: { id: null, isOpen: false } }),
}))

export function openCardModal(cardId: number) {
  useCardModalStore.getState().open(cardId)
}

export function closeCardModal() {
  useCardModalStore.getState().close()
}
