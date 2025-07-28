'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ChatMessage, Chat } from '@/interfaces/ai';
import { getChats, getChatHistory, sendMessage, deleteChat as deleteChatAPI } from '@/api';

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
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (message: string) => Promise<void>;
  loadChats: () => Promise<void>;
  loadChatHistory: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  createNewChat: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING_MESSAGE]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const loadChatHistory = useCallback(async (chatId: string) => {
    setIsLoading(true);
    const history = await getChatHistory(chatId);
    setMessages([GREETING_MESSAGE, ...history]);
    setCurrentChatId(chatId);
    setIsLoading(false);
  }, []);

  const loadChats = useCallback(async () => {
    setIsLoading(true);
    const fetchedChats = await getChats();
    setChats(fetchedChats);
    if (!currentChatId && fetchedChats.length > 0) {
      await loadChatHistory(fetchedChats[0].id);
    }
    setIsLoading(false);
  }, [currentChatId, loadChatHistory]);

  useEffect(() => {
    const isAuthPage = pathname?.startsWith('/auth');
    if (!isAuthPage) {
      loadChats();
    }
  }, [pathname, loadChats]);

  const openAssistant = () => setIsOpen(true);
  const closeAssistant = () => setIsOpen(false);
  const toggleAssistant = () => setIsOpen(prev => !prev);

  const createNewChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([GREETING_MESSAGE]);
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    setIsLoading(true);
    const success = await deleteChatAPI(chatId);
    if (success) {
      await loadChats();
      if (currentChatId === chatId) {
        createNewChat();
      }
    }
    setIsLoading(false);
  }, [currentChatId, loadChats, createNewChat]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { text: message, isUser: true, id: crypto.randomUUID() }]);
    setIsLoading(true);
    
    const responseMessage = await sendMessage({ message, chatId: currentChatId });
    
    if (responseMessage) {
      if(responseMessage.chatId){
        setCurrentChatId(responseMessage.chatId);
      }
      setMessages(prev => [...prev, responseMessage]);
    }
    
    await loadChats();
    setIsLoading(false);
  }, [currentChatId, loadChats]);

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
        sendMessage: handleSendMessage,
        loadChats,
        loadChatHistory,
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