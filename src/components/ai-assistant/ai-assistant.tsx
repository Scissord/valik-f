'use client';

import { useState } from 'react';
import { IoClose, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useAIAssistant } from './ai-context';

/**
 * Компонент ИИ-ассистента для помощи пользователям
 * Отображается в правом нижнем углу страницы
 */
export const AIAssistant = () => {
  // Получаем данные из контекста
  const { isOpen, messages, toggleAssistant, closeAssistant, sendMessage } = useAIAssistant();
  // Текущее сообщение пользователя
  const [userMessage, setUserMessage] = useState('');

  /**
   * Обработчик отправки сообщения
   */
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Отправляем сообщение через контекст
    sendMessage(userMessage);
    setUserMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Кнопка для открытия/закрытия чата */}
      {!isOpen ? (
        <button
          onClick={toggleAssistant}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-300"
          aria-label="Открыть чат с ассистентом"
        >
          <IoChatbubbleEllipsesOutline size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col overflow-hidden border border-gray-200">
          {/* Заголовок чата */}
          <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
            <h3 className="font-medium">ИИ-Ассистент</h3>
            <button 
              onClick={closeAssistant}
              className="text-white hover:bg-orange-600 rounded-full p-1 transition-colors"
              aria-label="Закрыть чат"
            >
              <IoClose size={20} />
            </button>
          </div>
          
          {/* Область сообщений */}
          <div className="flex-grow p-4 h-80 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`${
                  msg.isUser 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-gray-100 mr-auto'
                } rounded-lg p-3 max-w-[80%]`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          {/* Поле ввода */}
          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Введите сообщение..."
              className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userMessage.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg px-4 py-2 transition-colors"
            >
              Отправить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 