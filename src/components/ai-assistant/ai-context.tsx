'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Интерфейс для сообщения в чате
 */
export interface ChatMessage {
  text: string;
  isUser: boolean;
}

/**
 * Интерфейс контекста ИИ-ассистента
 */
interface AIAssistantContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  sendMessage: (message: string) => void;
}

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: 'Здравствуйте! Чем я могу вам помочь сегодня?', isUser: false }
  ]);

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
   * Отправить сообщение ассистенту
   */
  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Добавляем сообщение пользователя в историю
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    
    // Имитация ответа ассистента
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          text: 'Спасибо за ваше сообщение! В настоящее время я работаю в демонстрационном режиме.', 
          isUser: false 
        }
      ]);
    }, 1000);
  };

  return (
    <AIAssistantContext.Provider 
      value={{ 
        isOpen, 
        messages, 
        openAssistant, 
        closeAssistant, 
        toggleAssistant, 
        sendMessage 
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