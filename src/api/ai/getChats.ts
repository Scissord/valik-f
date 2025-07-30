import api from "../axios";
import { Chat, ServerChat } from "@/interfaces";

export const getChats = async (): Promise<Chat[]> => {
  try {
    const response = await api.get('/api/chats/');

    const responseData = response.data;
    const chatsData = responseData.data || responseData;

    if (!Array.isArray(chatsData)) {
      console.warn('Получены некорректные данные чатов:', chatsData);
      return [];
    }

    return (chatsData as ServerChat[])
      .filter(chat => chat.is_active !== false) // Фильтруем только активные чаты
      .map(chat => {
        // Находим последнее сообщение пользователя для превью
        const userMessages = chat.messages?.filter(msg => msg.role === 'user') || [];
        const lastUserMessage = userMessages[userMessages.length - 1];

        return {
          id: chat.id.toString(),
          title: chat.title || 'Новый чат',
          lastMessage: lastUserMessage?.content || '',
          lastTimestamp: chat.updated_at || chat.created_at,
          createdAt: chat.created_at,
          updatedAt: chat.updated_at
        };
      })
      .sort((a, b) => {
        // Сортируем по времени последнего обновления (новые сверху)
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
  } catch (error) {
    console.error('Ошибка при получении списка чатов:', error);
    return [];
  }
}; 