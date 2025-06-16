import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/interfaces/user";

interface State {
  user: User | null;
  setUser: (user: User, accessToken: string) => void;
  logout: () => void;
}

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user, accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        set({ user });
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        set({ user: null })
      },
    }),
    {
      name: "user",
    }
  )
);