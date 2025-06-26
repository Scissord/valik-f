'use client';

import { useState, useEffect } from 'react';
import { IoClose, IoChatbubbleEllipsesOutline, IoTrashOutline, IoAddOutline, IoReloadOutline } from 'react-icons/io5';
import { useAIAssistant } from './ai-context';

/**
 * Компонент ИИ-ассистента для помощи пользователям
 * Отображается в правом нижнем углу страницы
 */
export const AIAssistant = () => {
  // Получаем данные из контекста
  const { 
    isOpen, 
    messages, 
    chats,
    currentChatId,
    isLoading,
    toggleAssistant, 
    closeAssistant, 
    sendMessage,
    getChats,
    getChatHistory,
    deleteChat,
    createNewChat
  } = useAIAssistant();

  // Текущее сообщение пользователя
  const [userMessage, setUserMessage] = useState('');
  // Показывать ли список чатов
  const [showChatsList, setShowChatsList] = useState(false);

  /**
   * Обработчик отправки сообщения
   */
  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;
    
    // Отправляем сообщение через контекст
    await sendMessage(userMessage);
    setUserMessage('');
  };

  /**
   * Обработчик выбора чата
   */
  const handleSelectChat = async (chatId: string) => {
    await getChatHistory(chatId);
    setShowChatsList(false);
  };

  /**
   * Обработчик удаления чата
   */
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем выбор чата
    await deleteChat(chatId);
  };

  /**
   * Обработчик создания нового чата
   */
  const handleCreateNewChat = () => {
    createNewChat();
    setShowChatsList(false);
  };

  /**
   * Загрузка чатов при открытии ассистента
   */
  useEffect(() => {
    if (isOpen) {
      getChats();
    }
  }, [isOpen]);

  /**
   * Текущий заголовок чата
   */
  const currentChatTitle = currentChatId 
    ? chats.find(chat => chat.id === currentChatId)?.title || 'Новый чат' 
    : 'Новый чат';

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
            <div className="flex items-center space-x-2 flex-1 cursor-pointer" onClick={() => setShowChatsList(!showChatsList)}>
              <h3 className="font-medium truncate">{currentChatTitle}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => getChats()}
                className="text-white hover:bg-orange-600 rounded-full p-1 transition-colors"
                aria-label="Обновить список чатов"
              >
                <IoReloadOutline size={20} />
              </button>
              <button 
                onClick={handleCreateNewChat}
                className="text-white hover:bg-orange-600 rounded-full p-1 transition-colors"
                aria-label="Создать новый чат"
              >
                <IoAddOutline size={20} />
              </button>
              <button 
                onClick={closeAssistant}
                className="text-white hover:bg-orange-600 rounded-full p-1 transition-colors"
                aria-label="Закрыть чат"
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>
          
          {/* Выпадающий список чатов */}
          {showChatsList && (
            <div className="max-h-64 overflow-y-auto border-b border-gray-200">
              {chats.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Нет доступных чатов
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {chats.map(chat => (
                    <li 
                      key={chat.id} 
                      className={`
                        p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50
                        ${currentChatId === chat.id ? 'bg-orange-50' : ''}
                      `}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      <div className="flex-1 truncate">
                        <p className="font-medium">{chat.title}</p>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
                        aria-label="Удалить чат"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {/* Область сообщений */}
          <div className="flex-grow p-4 h-80 overflow-y-auto flex flex-col gap-3">
            {messages.length === 0 && !isLoading ? (
              <div className="text-center text-gray-500 my-auto">
                Начните новый разговор
              </div>
            ) : (
              messages.map((msg, index) => (
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
              ))
            )}
            {isLoading && (
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] mr-auto flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Поле ввода */}
          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Введите сообщение..."
              disabled={isLoading}
              className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userMessage.trim() || isLoading}
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