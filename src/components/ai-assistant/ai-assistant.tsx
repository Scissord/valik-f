'use client';

import { useState, useEffect, useRef } from 'react';
import { IoClose, IoChatbubbleEllipsesOutline, IoTrashOutline, IoAddOutline, IoReloadOutline, IoSendOutline, IoLogInOutline } from 'react-icons/io5';
import { useAIAssistant } from './ai-context';
import { useUserStore } from '@/store';
import Link from 'next/link';

export const AIAssistant = () => {
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
  
  const user = useUserStore((state) => state.user);
  const [userMessage, setUserMessage] = useState('');
  const [showChatsList, setShowChatsList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;
    
    await sendMessage(userMessage);
    setUserMessage('');
  };

  const handleSelectChat = async (chatId: string) => {
    await getChatHistory(chatId);
    setShowChatsList(false);
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteChat(chatId);
  };

  const handleCreateNewChat = () => {
    createNewChat();
    setShowChatsList(false);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && user) {
      getChats();
    }
  }, [isOpen, user, getChats]);

  const currentChatTitle = currentChatId 
    ? chats.find(chat => chat.id === currentChatId)?.title || 'Новый чат' 
    : 'Новый чат';

  if (!user) {
    return (
      <div className="fixed right-4 sm:right-6 z-50 bottom-20 sm:bottom-24 lg:bottom-6">
        {!isOpen ? (
          <button
            onClick={toggleAssistant}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
            aria-label="Открыть чат с ассистентом"
          >
            <IoChatbubbleEllipsesOutline className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl w-[90vw] sm:w-96 max-w-[90vw] flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 animate-fade-in">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 flex-1">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <IoChatbubbleEllipsesOutline className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Требуется авторизация</h3>
                </div>
              </div>
              <button 
                onClick={closeAssistant}
                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                aria-label="Закрыть чат"
              >
                <IoClose className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex-grow p-4 flex flex-col items-center justify-center text-center bg-gray-50">
              <IoLogInOutline className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">Войдите, чтобы продолжить</p>
              <p className="text-sm text-gray-500 mb-6">Для доступа к ИИ-ассистенту необходимо авторизоваться.</p>
              <Link href="/auth/login" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-600 transition-colors">
                Войти
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed right-4 sm:right-6 z-50 bottom-20 sm:bottom-24 lg:bottom-6">
      {!isOpen ? (
        <button
          onClick={toggleAssistant}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
          aria-label="Открыть чат с ассистентом"
        >
          <IoChatbubbleEllipsesOutline className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl w-[90vw] sm:w-96 max-w-[90vw] flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 animate-fade-in">
          {/* Заголовок чата */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 flex-1 cursor-pointer" onClick={() => setShowChatsList(!showChatsList)}>
              <div className="bg-white/20 p-1.5 rounded-full">
                <IoChatbubbleEllipsesOutline className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium truncate">{currentChatTitle}</h3>
                <p className="text-xs text-white/70">{showChatsList ? 'Скрыть чаты' : 'Показать чаты'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button 
                onClick={() => getChats()}
                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                aria-label="Обновить список чатов"
              >
                <IoReloadOutline className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={handleCreateNewChat}
                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                aria-label="Создать новый чат"
              >
                <IoAddOutline className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                onClick={closeAssistant}
                className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                aria-label="Закрыть чат"
              >
                <IoClose className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          
          {/* Выпадающий список чатов */}
          {showChatsList && (
            <div className="max-h-64 overflow-y-auto border-b border-gray-200 bg-gray-50">
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
                        p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors
                        ${currentChatId === chat.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''}
                      `}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      <div className="flex-1 truncate">
                        <p className="font-medium">{chat.title}</p>
                        {chat.lastMessage && (
                          <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
                        aria-label="Удалить чат"
                      >
                        <IoTrashOutline className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {/* Область сообщений */}
          <div className="flex-grow p-3 sm:p-4 h-72 sm:h-80 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {messages.length === 0 && !isLoading ? (
              <div className="text-center text-gray-500 my-auto flex flex-col items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <IoChatbubbleEllipsesOutline className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Начните новый разговор</p>
                  <p className="text-xs text-gray-400">Задайте вопрос ассистенту</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`${
                    msg.isUser 
                      ? 'bg-orange-100 ml-auto rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl' 
                      : 'bg-white mr-auto rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-sm'
                  } p-3 max-w-[85%] animate-fade-in`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`text-[10px] mt-1 ${msg.isUser ? 'text-orange-400' : 'text-gray-400'}`}>
                    {msg.isUser ? 'Вы' : 'Ассистент'} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="bg-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-sm p-3 max-w-[85%] mr-auto animate-fade-in">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Поле ввода */}
          <div className="border-t border-gray-200 p-3 flex gap-2 bg-white">
            <div className="flex-grow relative">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Введите сообщение..."
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 pr-10"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userMessage.trim() || isLoading}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-full p-1.5 transition-colors"
              >
                <IoSendOutline className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 