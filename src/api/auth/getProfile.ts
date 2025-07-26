import api from "../axios";
import { User } from "@/interfaces";

export const getProfile = async (): Promise<User | null> => {
  try {
    // Предполагаем, что токен уже добавлен в interceptor-е axios
    const { data } = await api.get<User>('/auth/profile');
    return data;
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    // В случае ошибки (например, 401 Unauthorized), возвращаем null
    return null;
  }
}; 