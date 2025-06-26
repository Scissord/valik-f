'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

/**
 * Интерфейс для сообщения в чате
 */
export interface ChatMessage {
  text: string;
  isUser: boolean;
  id?: string;
  timestamp?: string;
}

/**
 * Интерфейс для чата
 */
export interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  lastTimestamp?: string;
}

/**
 * Интерфейс контекста ИИ-ассистента
 */
interface AIAssistantContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (message: string) => Promise<void>;
  getChats: () => Promise<void>;
  getChatHistory: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  createNewChat: () => void;
}

// Базовый URL для API
const API_BASE_URL = 'http://26.34.25.229:8080/api';

/**
 * Контекст для управления состоянием ИИ-ассистента
 */
const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

/**
 * Провайдер контекста ИИ-ассистента
 */
export const AIAssistantProvider = ({ children }: { children: ReactNode }) => {
  // Состояние для отслеживания открыт ли чат с ассистентом
  const [isOpen, setIsOpen] = useState(false);
  
  // История сообщений в чате
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Список чатов
  const [chats, setChats] = useState<Chat[]>([]);
  
  // Текущий активный чат
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Загрузка списка чатов при инициализации компонента
   */
  useEffect(() => {
    getChats();
  }, []);

  /**
   * Открыть ассистента
   */
  const openAssistant = () => setIsOpen(true);
  
  /**
   * Закрыть ассистента
   */
  const closeAssistant = () => setIsOpen(false);
  
  /**
   * Переключить состояние ассистента
   */
  const toggleAssistant = () => setIsOpen(prev => !prev);
  
  /**
   * Создать новый чат
   */
  const createNewChat = () => {
    // Временно всегда устанавливаем chatId = 1
    setCurrentChatId('1');
    setMessages([
      { text: 'Здравствуйте! Чем я могу вам помочь сегодня?', isUser: false }
    ]);
  };

  /**
   * Получить список чатов
   */
  const getChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/chats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Не удалось получить список чатов');
      }
      
      const responseData = await response.json();
      const chatsData = responseData.data || responseData;
      
      // Преобразуем данные в нужный формат, если необходимо
      const formattedChats = Array.isArray(chatsData) 
        ? chatsData 
        : [];
      
      setChats(formattedChats);
      
      // Если нет активного чата и есть чаты в списке, выбираем первый
      if (!currentChatId && formattedChats.length > 0) {
        getChatHistory(formattedChats[0].id);
      }
    } catch (error) {
      console.error('Ошибка при получении списка чатов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Получить историю сообщений чата
   */
  const getChatHistory = async (chatId: string) => {
    try {
      setIsLoading(true);
      // Временно всегда используем chatId = 1
      const fixedChatId = '1';
      
      const response = await fetch(`${API_BASE_URL}/chats/${fixedChatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Не удалось получить историю чата');
      }
      
      const responseData = await response.json();
      const messagesData = responseData.data || responseData;
      
      // Преобразуем полученные сообщения в нужный формат
      const formattedMessages = Array.isArray(messagesData) 
        ? messagesData.map(msg => ({
            text: msg.message || msg.text,
            isUser: msg.isUser || msg.sender === 'user',
            id: msg.id,
            timestamp: msg.timestamp || msg.createdAt
          }))
        : [];
      
      setMessages(formattedMessages);
      setCurrentChatId('1'); // Всегда устанавливаем chatId = 1
    } catch (error) {
      console.error('Ошибка при получении истории чата:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Удалить чат
   */
  const deleteChat = async (chatId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Не удалось удалить чат');
      }
      
      // Обновляем список чатов
      await getChats();
      
      // Если был удален текущий чат, создаем новый
      if (currentChatId === chatId) {
        createNewChat();
      }
    } catch (error) {
      console.error('Ошибка при удалении чата:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Отправить сообщение ассистенту
   */
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Добавляем сообщение пользователя в историю
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setIsLoading(true);
    
    try {
      // Отправляем сообщение на сервер
      // Временно всегда используем chatId = 1
      const requestBody = {
        message: message,
        chatId: 1 // Фиксированный chatId = 1 согласно требованию
      };
      
      const response = await fetch(`${API_BASE_URL}/chats/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось отправить сообщение');
      }
      
      const responseData = await response.json();
      
      // Проверяем структуру ответа
      const data = responseData.data || responseData;
      
      // Устанавливаем текущий чат как 1
      setCurrentChatId('1');
      
      // Добавляем ответ от ассистента
      if (data.message) {
        setMessages(prev => [...prev, { text: data.message, isUser: false }]);
      } else {
        setMessages(prev => [...prev, { text: data.text || data.answer || 'Получен ответ от ассистента', isUser: false }]);
      }
      
      // Обновляем список чатов
      await getChats();
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      setMessages(prev => [
        ...prev,
        { 
          text: error instanceof Error ? error.message : 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.', 
          isUser: false 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Тестовый вызов API для получения ответа от ассистента
  const testAssistantAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/assistant/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'привет как дела'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось получить ответ от ассистента');
      }
      
      const responseData = await response.json();
      const data = responseData.data || responseData;
      
      console.log('Ответ от ассистента:', data);
      
      // Если нужно, можно добавить сообщение в текущий чат
      if (data.message) {
        setMessages(prev => [
          ...prev, 
          { text: 'привет как дела', isUser: true },
          { text: data.message, isUser: false }
        ]);
      }
    } catch (error) {
      console.error('Ошибка при вызове API ассистента:', error);
    }
  };

  return (
    <AIAssistantContext.Provider 
      value={{ 
        isOpen, 
        messages, 
        chats,
        currentChatId,
        isLoading,
        openAssistant, 
        closeAssistant, 
        toggleAssistant, 
        sendMessage,
        getChats,
        getChatHistory,
        deleteChat,
        createNewChat
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

/**
 * Хук для использования контекста ИИ-ассистента
 */
export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant должен использоваться внутри AIAssistantProvider');
  }
  return context;
}; 