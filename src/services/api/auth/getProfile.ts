import api from "../axios";
import type { User } from "@/lib/legacy";

export const getProfile = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    return null;
  }
}; 
