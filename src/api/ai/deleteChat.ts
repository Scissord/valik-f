import api from "../axios";

export const deleteChat = async (chatId: string): Promise<boolean> => {
  try {
    await api.delete(`/api/chats/${chatId}`);
    return true;
  } catch (error) {
    console.error('Ошибка при удалении чата:', error);
    return false;
  }
}; 