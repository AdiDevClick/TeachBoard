import { DEV_MODE } from "@/configs/app.config.ts";
import { create } from "zustand";

export const useAppStore = create<AppStoreType>()((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  user: null,
  async login(userData: any) {
    if (DEV_MODE) {
      console.debug("Login in store:", userData);
    }
  },
}));
