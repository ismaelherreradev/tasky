import { atom } from "jotai";

const idAtom = atom<number | undefined>(undefined);
const isOpenAtom = atom(false);

const onOpenAtom = atom(null, (get, set, id: number) => {
  set(isOpenAtom, true);
  set(idAtom, id);
});

const onCloseAtom = atom(null, (get, set) => {
  set(isOpenAtom, false);
  set(idAtom, undefined);
});

const cardModalAtom = atom(
  (get) => ({
    id: get(idAtom),
    isOpen: get(isOpenAtom),
  }),
  (get, set, action: { type: "open" | "close"; id?: number }) => {
    if (action.type === "open" && action.id !== undefined) {
      set(onOpenAtom, action.id);
    } else if (action.type === "close") {
      set(onCloseAtom);
    }
  },
);

export { cardModalAtom, onOpenAtom, onCloseAtom };
