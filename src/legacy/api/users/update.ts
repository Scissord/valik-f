import api from "../axios";
import type { User } from "@/lib/legacy";

export const update = async (userId: number, data: Partial<User>) => {
  const response = await api.patch<User>(`/users/${userId}`, data);
  return response.data;
};
