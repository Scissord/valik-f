import api from "../axios";
import type { ChatMessage } from "@/lib/legacy";

interface SendMessageParams {
  message: string;
  chatId: string | null;
}

interface SendMessageResponse {
  chatId?: string | number;
  message?: string;
  text?: string;
  answer?: string;
  content?: string;
  chat_id?: number;
}

export const sendMessage = async ({ message, chatId }: SendMessageParams): Promise<ChatMessage | null> => {
  try {
    const requestBody: { message: string; chatId?: string | null } = {
      message: message,
      chatId: chatId
    };
    
    const response = await api.post('/api/chats/message', requestBody);
    
    const responseData = response.data;
    const data: SendMessageResponse = responseData.data || responseData;
    
    return {
      text: data.message || data.text || data.answer || data.content || 'Получен ответ от ассистента',
      isUser: false,
      id: crypto.randomUUID(),
      chatId: (data.chatId || data.chat_id)?.toString()
    };
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.';
    return {
      text: errorMessage,
      isUser: false,
      id: crypto.randomUUID()
    };
  }
}; 
