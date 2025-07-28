'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import api from '@/api/axios';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  id: string;
  timestamp?: string;
}

export interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  lastTimestamp?: string;
}

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

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isAuthPage = pathname?.startsWith('/auth');
    if (!isAuthPage) {
      getChats();
    }
  }, [pathname]);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);
  const toggleAssistant = () => setIsOpen(prev => !prev);

  const createNewChat = () => {
    setCurrentChatId('1');
    setMessages([
      { text: 'Здравствуйте! Чем я могу вам помочь сегодня?', isUser: false, id: crypto.randomUUID() }
    ]);
  };

  const getChats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/chats');
      
      const responseData = response.data;
      const chatsData = responseData.data || responseData;
      
      const formattedChats = Array.isArray(chatsData) 
        ? chatsData 
        : [];
      
      setChats(formattedChats);
      
      if (!currentChatId && formattedChats.length > 0) {
        getChatHistory(formattedChats[0].id);
      }
    } catch (error) {
      console.error('Ошибка при получении списка чатов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getChatHistory = async (chatId: string) => {
    try {
      setIsLoading(true);
      const fixedChatId = '1';
      
      const response = await api.get(`/api/chats/${fixedChatId}`);
      
      const responseData = response.data;
      const messagesData = responseData.data || responseData;
      
      const formattedMessages = Array.isArray(messagesData) 
        ? messagesData.map(msg => ({
            text: msg.message || msg.text,
            isUser: msg.isUser || msg.sender === 'user',
            id: msg.id,
            timestamp: msg.timestamp || msg.createdAt
          }))
        : [];
      
      setMessages(formattedMessages);
      setCurrentChatId('1');
    } catch (error) {
      console.error('Ошибка при получении истории чата:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/api/chats/${chatId}`);
      
      await getChats();
      
      if (currentChatId === chatId) {
        createNewChat();
      }
    } catch (error) {
      console.error('Ошибка при удалении чата:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { text: message, isUser: true, id: crypto.randomUUID() }]);
    setIsLoading(true);
    
    try {
      const requestBody = {
        message: message,
        chatId: 1
      };
      
      const response = await api.post('/api/chats/message', requestBody);
      
      const responseData = response.data;
      
      const data = responseData.data || responseData;
      
      setCurrentChatId('1');
      
      if (data.message) {
        setMessages(prev => [...prev, { text: data.message, isUser: false, id: crypto.randomUUID() }]);
      } else {
        setMessages(prev => [...prev, { text: data.text || data.answer || 'Получен ответ от ассистента', isUser: false, id: crypto.randomUUID() }]);
      }
      
      await getChats();
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      setMessages(prev => [
        ...prev,
        { 
          text: error instanceof Error ? error.message : 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.', 
          isUser: false,
          id: crypto.randomUUID()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const testAssistantAPI = async () => {
    try {
      const response = await api.post('/api/assistant/', {
        message: 'привет как дела'
      });
      
      const responseData = response.data;
      const data = responseData.data || responseData;
      
      console.log('Ответ от ассистента:', data);
      
      if (data.message) {
        setMessages(prev => [
          ...prev, 
          { text: 'привет как дела', isUser: true, id: crypto.randomUUID() },
          { text: data.message, isUser: false, id: crypto.randomUUID() }
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

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant должен использоваться внутри AIAssistantProvider');
  }
  return context;
};