import { create } from "zustand";

interface State {
  isSideMenuOpen: boolean;
}

export const useUIStore = create<State>(() => ({
  isSideMenuOpen: true,
}));
