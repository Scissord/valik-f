'use client';

import { useAIAssistant } from '../ai-context';
import Image from 'next/image';

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
      iconSize: 16,
      button: 'px-3 py-1.5 text-sm',
    },
    md: {
      icon: 'w-10 h-10',
      iconSize: 20,
      button: 'px-4 py-2',
    },
    lg: {
      icon: 'w-12 h-12',
      iconSize: 24,
      button: 'px-5 py-2.5 text-lg',
    }
  };
  
  if (variant === 'icon') {
    return (
      <button
        onClick={openAssistant}
        className={`flex items-center justify-center rounded-full 
          bg-white hover:bg-gray-50
          shadow-[0_4px_14px_0_rgba(30,64,175,0.4)] hover:shadow-[0_6px_20px_0_rgba(30,64,175,0.5)] 
          transition-all duration-300 
          ${sizeClasses[size].icon} hover:scale-110 ${className}`}
        aria-label="Открыть ассистента"
      >
        <Image 
          src="/ai.svg" 
          alt="AI Assistant" 
          width={sizeClasses[size].iconSize} 
          height={sizeClasses[size].iconSize}
          className="transition-transform"
        />
      </button>
    );
  }
  
  return (
    <button
      onClick={openAssistant}
      className={`flex items-center gap-2 rounded-full 
        bg-white hover:bg-gray-50
        shadow-[0_4px_14px_0_rgba(30,64,175,0.4)] hover:shadow-[0_6px_20px_0_rgba(30,64,175,0.5)]
        transition-all duration-300
        ${sizeClasses[size].button} ${className}`}
      aria-label="Открыть ассистента"
    >
      <Image 
        src="/ai.svg" 
        alt="AI Assistant" 
        width={sizeClasses[size].iconSize} 
        height={sizeClasses[size].iconSize}
      />
      <span className="text-gray-700">{text}</span>
    </button>
  );
}; 
