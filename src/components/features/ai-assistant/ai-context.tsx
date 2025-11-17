'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import type { ChatMessage, Chat } from '@/lib/legacy';
import { getChats, getChatHistory, sendMessage, deleteChat as deleteChatAPI } from '@/lib/legacy';

const GREETING_MESSAGE: ChatMessage = {
  text: 'Здравствуйте! Чем я могу вам помочь сегодня?',
  isUser: false,
  id: 'initial-greeting'
};

interface AIAssistantContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
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
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING_MESSAGE]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadChatHistory = useCallback(async (chatId: string) => {
    setIsLoading(true);
    try {
      const history = await getChatHistory(chatId);
      // Показываем приветственное сообщение только если чат пустой
      if (history.length === 0) {
        setMessages([GREETING_MESSAGE]);
      } else {
        setMessages(history);
      }
      setCurrentChatId(chatId);
      // Сохраняем ID текущего чата в localStorage
      localStorage.setItem('ai-assistant-current-chat', chatId);
    } catch (error) {
      console.error('Ошибка при загрузке истории чата:', error);
      setError('Не удалось загрузить историю чата');
      setMessages([GREETING_MESSAGE]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadChats = useCallback(async (shouldAutoLoadChat = true) => {
    const isCreatingNewChatMarker = localStorage.getItem('ai-assistant-creating-new-chat') === 'true';
    
    try {
      const fetchedChats = await getChats();
      setChats(fetchedChats);
      
      // Автоматически загружаем чат только если это разрешено, нет текущего чата и не создается новый чат
      if (shouldAutoLoadChat && !currentChatId && !isCreatingNewChatMarker && fetchedChats.length > 0) {
        const savedChatId = localStorage.getItem('ai-assistant-current-chat');
        const chatToLoad = savedChatId && fetchedChats.find(chat => chat.id === savedChatId) 
          ? savedChatId 
          : fetchedChats[0].id; // Берем последний чат если сохраненный не найден
        
        await loadChatHistory(chatToLoad);
      }
    } catch (error) {
      console.error('Ошибка при загрузке чатов:', error);
      setError('Не удалось загрузить список чатов');
      setChats([]);
    }
  }, [currentChatId, loadChatHistory]);

  useEffect(() => {
    const isAuthPage = pathname?.startsWith('/auth');
    const isCreatingNewChatMarker = localStorage.getItem('ai-assistant-creating-new-chat') === 'true';
    
    if (!isAuthPage && !isCreatingNewChatMarker) {
      loadChats(true); // Только при первой загрузке разрешаем автозагрузку чата
    }
  }, [pathname, loadChats]);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);
  const toggleAssistant = () => setIsOpen(prev => !prev);

  const createNewChat = useCallback(() => {
    // Устанавливаем специальный маркер в localStorage, чтобы предотвратить автозагрузку
    localStorage.setItem('ai-assistant-creating-new-chat', 'true');
    
    setCurrentChatId(null);
    setMessages([GREETING_MESSAGE]);
    setError(null); // Очищаем ошибки при создании нового чата
    
    // Удаляем сохраненный ID чата из localStorage
    localStorage.removeItem('ai-assistant-current-chat');
    
    // Убираем маркер через небольшую задержку
    setTimeout(() => {
      localStorage.removeItem('ai-assistant-creating-new-chat');
    }, 1000);
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    setIsLoading(true);
    try {
      const success = await deleteChatAPI(chatId);
      if (success) {
        // Обновляем список чатов
        await loadChats(false);
        
        // Если удаляем текущий чат, создаем новый
        if (currentChatId === chatId) {
          createNewChat();
        }
      }
    } catch (error) {
      console.error('Ошибка при удалении чата:', error);
      setError('Не удалось удалить чат');
    } finally {
      setIsLoading(false);
    }
  }, [currentChatId, loadChats, createNewChat]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = { 
      text: message, 
      isUser: true, 
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => {
      // Убираем приветственное сообщение при первом сообщении пользователя
      const filteredMessages = prev.filter(msg => msg.id !== 'initial-greeting');
      return [...filteredMessages, userMessage];
    });
    
    setIsLoading(true);
    
    try {
      const responseMessage = await sendMessage({ message, chatId: currentChatId });
      
      if (responseMessage) {
        // Если получили новый chatId, обновляем текущий чат
        if (responseMessage.chatId && responseMessage.chatId !== currentChatId) {
          setCurrentChatId(responseMessage.chatId);
          // Сохраняем новый ID чата в localStorage
          localStorage.setItem('ai-assistant-current-chat', responseMessage.chatId);
        }
        
        // Добавляем ответ ассистента
        setMessages(prev => [...prev, {
          ...responseMessage,
          timestamp: new Date().toISOString()
        }]);
        
        // Обновляем список чатов для отображения нового/обновленного чата
        // Делаем это асинхронно, чтобы не блокировать UI
        // Передаем false, чтобы не загружать автоматически другой чат
        setTimeout(() => {
          loadChats(false);
        }, 100);
      }
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      setError('Не удалось отправить сообщение');
      // Добавляем сообщение об ошибке
      setMessages(prev => [...prev, {
        text: 'Произошла ошибка при отправке сообщения. Попробуйте еще раз.',
        isUser: false,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentChatId, loadChats]);

  return (
    <AIAssistantContext.Provider 
      value={{ 
        isOpen, 
        messages, 
        chats,
        currentChatId,
        isLoading,
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
