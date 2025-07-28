import api from "../axios";
import { Chat } from "@/interfaces";

export const getChats = async (): Promise<Chat[]> => {
  try {
    const response = await api.get('/api/chats/');
    
    const responseData = response.data;
    const chatsData = responseData.data || responseData;
    
    return Array.isArray(chatsData) ? chatsData : [];
  } catch (error) {
    console.error('Ошибка при получении списка чатов:', error);
    return [];
  }
}; 