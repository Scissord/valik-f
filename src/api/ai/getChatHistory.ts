import api from "../axios";
import { ChatMessage } from "@/interfaces";

export const getChatHistory = async (chatId: string): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(`/api/chats/${chatId}`);
    
    const responseData = response.data;
    const messagesData = responseData.data || responseData;
    
    return Array.isArray(messagesData) 
      ? messagesData.map(msg => ({
          text: msg.message || msg.text,
          isUser: msg.isUser || msg.sender === 'user',
          id: msg.id,
          timestamp: msg.timestamp || msg.createdAt
        }))
      : [];
  } catch (error) {
    console.error('Ошибка при получении истории чата:', error);
    return [];
  }
}; 