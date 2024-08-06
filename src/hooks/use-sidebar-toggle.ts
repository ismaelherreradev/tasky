import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SidebarToggleState = {
  isOpen: boolean;
};

type SidebarToggleActions = {
  toggleSidebar: () => void;
};

type SidebarToggleStore = SidebarToggleState & SidebarToggleActions;

const useSidebarToggle = create<SidebarToggleStore>()(
  persist(
    (set, _) => ({
      isOpen: true,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "sidebar-open",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSidebarToggle;
