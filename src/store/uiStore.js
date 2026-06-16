import { create } from "zustand";

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  loading: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  setLoading: (isLoading) => set({ loading: isLoading }),
}));
