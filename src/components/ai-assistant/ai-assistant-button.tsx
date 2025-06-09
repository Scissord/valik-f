'use client';

import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useAIAssistant } from './ai-context';

/**
 * Интерфейс свойств компонента
 */
interface AIAssistantButtonProps {
  className?: string;
  variant?: 'icon' | 'button';
  text?: string;
}

/**
 * Кнопка для вызова ИИ-ассистента, которую можно разместить в любом месте приложения
 */
export const AIAssistantButton = ({ 
  className = '',
  variant = 'button',
  text = 'Помощь ассистента'
}: AIAssistantButtonProps) => {
  const { openAssistant } = useAIAssistant();
  
  if (variant === 'icon') {
    return (
      <button
        onClick={openAssistant}
        className={`flex items-center justify-center w-10 h-10 rounded-full 
          bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors ${className}`}
        aria-label="Открыть ассистента"
      >
        <IoChatbubbleEllipsesOutline size={20} />
      </button>
    );
  }
  
  return (
    <button
      onClick={openAssistant}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg 
        bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors ${className}`}
      aria-label="Открыть ассистента"
    >
      <IoChatbubbleEllipsesOutline size={18} />
      <span>{text}</span>
    </button>
  );
}; 