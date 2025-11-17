'use client';

import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useAIAssistant } from '../ai-context';

interface AIAssistantButtonProps {
  className?: string;
  variant?: 'icon' | 'button';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AIAssistantButton = ({ 
  className = '',
  variant = 'button',
  text = 'Помощь ассистента',
  size = 'md'
}: AIAssistantButtonProps) => {
  const { openAssistant } = useAIAssistant();
  
  const sizeClasses = {
    sm: {
      icon: 'w-8 h-8',
      iconSize: 'w-4 h-4',
      button: 'px-3 py-1.5 text-sm',
    },
    md: {
      icon: 'w-10 h-10',
      iconSize: 'w-5 h-5',
      button: 'px-4 py-2',
    },
    lg: {
      icon: 'w-12 h-12',
      iconSize: 'w-6 h-6',
      button: 'px-5 py-2.5 text-lg',
    }
  };
  
  if (variant === 'icon') {
    return (
      <button
        onClick={openAssistant}
        className={`flex items-center justify-center rounded-full 
          bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
          text-white shadow-lg hover:shadow-xl transition-all duration-300 
          ${sizeClasses[size].icon} animate-pulse-slow ${className}`}
        aria-label="Открыть ассистента"
      >
        <IoChatbubbleEllipsesOutline className={sizeClasses[size].iconSize} />
      </button>
    );
  }
  
  return (
    <button
      onClick={openAssistant}
      className={`flex items-center gap-2 rounded-full 
        bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
        text-white shadow-lg hover:shadow-xl transition-all duration-300
        ${sizeClasses[size].button} ${className}`}
      aria-label="Открыть ассистента"
    >
      <IoChatbubbleEllipsesOutline className={sizeClasses[size].iconSize} />
      <span>{text}</span>
    </button>
  );
}; 
