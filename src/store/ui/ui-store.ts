import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
  isSideMenuOpen: boolean;
  openSideMenu: () => void;
  closeSideMenu: () => void;
}

export const useUIStore = create<State>()(
  devtools(
    (set) => ({
      isSideMenuOpen: false,
      openSideMenu: () =>
        set(() => ({ isSideMenuOpen: true }), undefined, "ui/openSideMenu"),
      closeSideMenu: () =>
        set(() => ({ isSideMenuOpen: false }), undefined, "ui/closeSideMenu"),
    }),
    {
      name: "ui-store",
      store: "ui-store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
