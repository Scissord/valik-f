import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/legacy";
import { getProfile } from "@/lib/legacy";

interface State {
  user: User | null;
  setUser: (user: User, accessToken: string) => void;
  logout: () => void;
  getProfile: () => Promise<void>;
}

export const useUserStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      getProfile: async () => {
        try {
          const user = await getProfile();
          if (user) {
            set({ user });
          } else {
            // Если профиль не загружен (например, токен невалиден),
            // очищаем данные пользователя
            set({ user: null });
            localStorage.removeItem("accessToken");
          }
        } catch (error) {
          console.error("Ошибка при обновлении профиля в сторе:", error);
          set({ user: null });
          localStorage.removeItem("accessToken");
        }
      },
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
