import api from "../axios";
import type { User } from "@/lib/legacy";

export const getProfile = async (): Promise<User | null> => {
  try {
    const buyerId = typeof window !== "undefined" ? localStorage.getItem("buyerId") : null;
    if (!buyerId) return null;
    const { data } = await api.get<User>(`/buyer/api/buyer/${buyerId}/`);
    return data;
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    return null;
  }
};

