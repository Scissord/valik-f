import api from "../axios";
import { User } from "@/interfaces";

export const getProfile = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    return null;
  }
}; 