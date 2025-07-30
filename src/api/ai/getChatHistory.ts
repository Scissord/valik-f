import api from "../axios";
import { ChatMessage, ServerChat } from "@/interfaces";

export const getChatHistory = async (chatId: string): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(`/api/chats/${chatId}`);
    
    const responseData = response.data;
    const chatData = responseData.data || responseData;
    
    // Проверяем, что получили объект чата с сообщениями
    if (!chatData || !chatData.messages || !Array.isArray(chatData.messages)) {
      console.warn('Получены некорректные данные истории чата:', chatData);
      return [];
    }
    
    return (chatData as ServerChat).messages
      .filter(msg => msg.role !== 'system') // Исключаем системные сообщения из отображения
      .map(msg => ({
        text: msg.content || '',
        isUser: msg.role === 'user',
        id: msg.id?.toString() || crypto.randomUUID(),
        timestamp: msg.created_at || msg.updated_at || new Date().toISOString(),
        chatId: chatId
      }))
      .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());
  } catch (error) {
    console.error('Ошибка при получении истории чата:', error);
    return [];
  }
}; 