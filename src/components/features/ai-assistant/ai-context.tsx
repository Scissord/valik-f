'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { ChatMessage } from '@/lib/legacy';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useUserStore } from '@/lib/legacy';

// WebSocket URL из переменных окружения (фиксированный для тестирования)
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://swaggger.imai.run/ws/web_test/chat/7823690/web_test';

export interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  lastTimestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AIAssistantContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (message: string) => Promise<void>;
  loadChats: (shouldAutoLoadChat?: boolean) => Promise<void>;
  loadChatHistory: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  createNewChat: () => void;
  clearError: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // WebSocket обработчик сообщений
  const handleWebSocketMessage = useCallback((data: any) => {
    console.log('📨 WebSocket message received:', data);
    
    // Очищаем таймаут если он был установлен
    if ((window as any).__wsMessageTimeout) {
      clearTimeout((window as any).__wsMessageTimeout);
      (window as any).__wsMessageTimeout = null;
    }
    
    // Сбрасываем isLoading при любом ответе
    setIsLoading(false);
    
    // Проверяем разные форматы ответа
    if (data.type === 'message' && data.message) {
      // Формат: { type: 'message', message: '...' }
      const assistantMessage: ChatMessage = {
        text: data.message,
        isUser: false,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        if (currentChatId) {
          localStorage.setItem(`ai-assistant-messages-${currentChatId}`, JSON.stringify(updatedMessages));
        }
        return updatedMessages;
      });
    } else if (data.message && !data.type) {
      // Формат: { message: '...' }
      const assistantMessage: ChatMessage = {
        text: data.message,
        isUser: false,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        if (currentChatId) {
          localStorage.setItem(`ai-assistant-messages-${currentChatId}`, JSON.stringify(updatedMessages));
        }
        return updatedMessages;
      });
    } else if (data.text) {
      // Формат: { text: '...' }
      const assistantMessage: ChatMessage = {
        text: data.text,
        isUser: false,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        if (currentChatId) {
          localStorage.setItem(`ai-assistant-messages-${currentChatId}`, JSON.stringify(updatedMessages));
        }
        return updatedMessages;
      });
    } else if (typeof data === 'string') {
      // Формат: просто строка
      const assistantMessage: ChatMessage = {
        text: data,
        isUser: false,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        if (currentChatId) {
          localStorage.setItem(`ai-assistant-messages-${currentChatId}`, JSON.stringify(updatedMessages));
        }
        return updatedMessages;
      });
    } else if (data.type === 'error') {
      // Формат ошибки
      setError(data.message || 'Произошла ошибка');
    } else {
      // Неизвестный формат
      console.warn('⚠️ Unknown message format:', data);
      setError('Получен ответ в неожиданном формате');
    }
  }, [currentChatId]);

  // Инициализация WebSocket
  const { sendMessage: wsSendMessage, isConnected } = useWebSocket(
    isOpen ? WS_URL : null,
    {
      onMessage: handleWebSocketMessage,
      onOpen: () => {
        console.log('WebSocket connection established');
        setError(null);
      },
      onClose: () => {
        console.log('WebSocket connection closed');
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        setError('Ошибка подключения к серверу');
      }
    }
  );

  const loadChatHistory = useCallback(async (chatId: string) => {
    // Загружаем историю сообщений из localStorage
    const savedMessagesStr = localStorage.getItem(`ai-assistant-messages-${chatId}`);
    if (savedMessagesStr) {
      try {
        const savedMessages = JSON.parse(savedMessagesStr);
        setMessages(savedMessages);
      } catch (e) {
        console.error('Error parsing saved messages:', e);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
    
    setCurrentChatId(chatId);
    localStorage.setItem('ai-assistant-current-chat', chatId);
  }, []);

  const loadChats = useCallback(async (shouldAutoLoadChat = true) => {
    // Для тестирования используем один фиксированный чат
    const defaultChat: Chat = {
      id: '7823690',
      title: 'Чат с ассистентом',
      lastMessage: '',
      lastTimestamp: new Date().toISOString()
    };
    
    setChats([defaultChat]);
    
    if (shouldAutoLoadChat && !currentChatId) {
      setCurrentChatId(defaultChat.id);
      // Загружаем историю сообщений
      const savedMessagesStr = localStorage.getItem(`ai-assistant-messages-${defaultChat.id}`);
      if (savedMessagesStr) {
        try {
          const savedMessages = JSON.parse(savedMessagesStr);
          setMessages(savedMessages);
        } catch (e) {
          console.error('Error parsing saved messages:', e);
        }
      }
    }
  }, [currentChatId]);

  useEffect(() => {
    const isAuthPage = pathname?.startsWith('/auth');

    if (!isAuthPage && isOpen) {
      loadChats(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isOpen]);

  // Загружаем историю сообщений при смене чата
  useEffect(() => {
    if (currentChatId) {
      const savedMessagesStr = localStorage.getItem(`ai-assistant-messages-${currentChatId}`);
      if (savedMessagesStr) {
        try {
          const savedMessages = JSON.parse(savedMessagesStr);
          setMessages(savedMessages);
        } catch (e) {
          console.error('Error parsing saved messages:', e);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
  }, [currentChatId]);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);
  const toggleAssistant = () => setIsOpen(prev => !prev);

  const createNewChat = useCallback(() => {
    // Для тестирования просто очищаем сообщения
    setMessages([]);
    setError(null);
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    // Для тестирования просто очищаем сообщения
    setMessages([]);
    localStorage.removeItem(`ai-assistant-messages-${chatId}`);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    if (!isConnected) {
      setError('Нет подключения к серверу. Попробуйте позже.');
      return;
    }

    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      text: message,
      isUser: true,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      // Сохраняем историю сообщений в localStorage
      if (currentChatId) {
        localStorage.setItem(`ai-assistant-messages-${currentChatId}`, JSON.stringify(updatedMessages));
      }
      return updatedMessages;
    });
    setIsLoading(true);
    setError(null);

    // Таймаут для автоматического сброса isLoading (30 секунд)
    const timeoutId = setTimeout(() => {
      console.warn('⏱️ Response timeout - no answer received');
      setIsLoading(false);
      setError('Превышено время ожидания ответа. Попробуйте еще раз.');
    }, 30000);

    try {
      // Пробуем разные форматы отправки
      console.log('📤 Sending message (format 1):', { type: 'message', message });
      
      // Формат 1: { type: 'message', message: '...' }
      let sent = wsSendMessage({
        type: 'message',
        message: message
      });

      if (!sent) {
        clearTimeout(timeoutId);
        
        // Формат 2: просто { message: '...' }
        console.log('📤 Trying format 2:', { message });
        sent = wsSendMessage({
          message: message
        });
        
        if (!sent) {
          // Формат 3: просто строка
          console.log('📤 Trying format 3 (plain string):', message);
          sent = wsSendMessage(message);
          
          if (!sent) {
            throw new Error('Не удалось отправить сообщение');
          }
        }
      }
      
      // Сохраняем timeoutId для возможной отмены при получении ответа
      (window as any).__wsMessageTimeout = timeoutId;
      
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('❌ Ошибка при отправке сообщения:', error);
      setError('Не удалось отправить сообщение');
      setIsLoading(false);
      
      // Добавляем сообщение об ошибке
      setMessages(prev => [...prev, {
        text: 'Произошла ошибка при отправке сообщения. Попробуйте еще раз.',
        isUser: false,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }]);
    }
  }, [isConnected, wsSendMessage, currentChatId]);

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        messages,
        chats,
        currentChatId,
        isLoading,
        isConnected,
        error,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        sendMessage: handleSendMessage,
        loadChats,
        loadChatHistory,
        deleteChat,
        createNewChat,
        clearError
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
