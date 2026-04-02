'use client';

import { useState, useEffect, useRef } from 'react';
import { IoClose, IoTrashOutline, IoAddOutline, IoReloadOutline, IoSendOutline, IoLogInOutline } from 'react-icons/io5';
import { useAIAssistant } from './ai-context';
import { useUserStore } from '@/lib/legacy';
import { formatMessageTime, formatChatTime } from '@/lib/legacy';
import Link from 'next/link';
import Image from 'next/image';

export const AIAssistant = () => {
  const {
    isOpen,
    messages,
    chats,
    currentChatId,
    isLoading,
    isConnected,
    error,
    toggleAssistant,
    closeAssistant,
    sendMessage,
    loadChats,
    loadChatHistory,
    deleteChat,
    createNewChat,
    clearError
  } = useAIAssistant();

  const user = useUserStore((state) => state.user);
  const [userMessage, setUserMessage] = useState('');
  const [showChatsList, setShowChatsList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;

    await sendMessage(userMessage);
    setUserMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setShowChatsList(false); // Сначала скрываем список для лучшего UX
    await loadChatHistory(chatId);
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteChat(chatId);
  };

  const handleCreateNewChat = () => {
    createNewChat();
    setShowChatsList(false);
    setUserMessage('');
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && user) {
      const isCreatingNewChatMarker = localStorage.getItem('ai-assistant-creating-new-chat') === 'true';

      if (!isCreatingNewChatMarker) {
        loadChats(true); // При открытии разрешаем автозагрузку чата
      } else {
        loadChats(false); // Только обновляем список без автозагрузки
      }

      // Фокусируемся на поле ввода при открытии
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, user, loadChats]);



  const currentChat = chats.find(chat => chat.id === currentChatId);
  const currentChatTitle = currentChat?.title || 'Новый чат';

  if (!user) {
    return (
      <div className="fixed right-4 sm:right-6 z-50 bottom-20 sm:bottom-24 lg:bottom-6">
        {!isOpen ? (
          <button
            onClick={toggleAssistant}
            className="bg-white/90 hover:bg-white rounded-full p-3 sm:p-4 shadow-[0_12px_32px_-8px_rgba(15,118,110,0.45)] hover:shadow-[0_16px_40px_-10px_rgba(15,118,110,0.55)] ring-1 ring-black/5 transition-all duration-300 flex items-center justify-center group backdrop-blur"
            aria-label="Открыть чат с ассистентом"
          >
            <Image 
              src="/ai.svg" 
              alt="AI Assistant" 
              width={24} 
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
            />
          </button>
        ) : (
          <div className="relative rounded-3xl shadow-[0_24px_60px_-20px_rgba(15,23,42,0.6)] w-[92vw] sm:w-[420px] max-w-[92vw] h-[540px] flex flex-col overflow-hidden border border-white/40 ring-1 ring-black/5 transition-all duration-300 animate-fade-in bg-white/70 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,#e0f2fe_0%,transparent_55%),radial-gradient(120%_120%_at_100%_0%,#ecfeff_0%,transparent_55%),radial-gradient(120%_120%_at_0%_100%,#f0fdf4_0%,transparent_55%)]"></div>
            <div className="relative z-10 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-700 text-white p-3 sm:p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3 flex-1">
                <div className="bg-white/15 p-2 rounded-full ring-1 ring-white/20">
                  <Image 
                    src="/ai.svg" 
                    alt="AI Assistant" 
                    width={20} 
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight">Требуется авторизация</h3>
                  <p className="text-xs text-white/70">Вход для доступа к ассистенту</p>
                </div>
              </div>
              <button
                onClick={closeAssistant}
                className="text-white/90 hover:text-white hover:bg-white/15 rounded-full p-1.5 transition-colors"
                aria-label="Закрыть чат"
              >
                <IoClose className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="relative z-10 flex-grow px-5 py-6 flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-[300px] rounded-3xl bg-white/85 backdrop-blur p-6 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.65)] border border-white/70">
                <p className="text-lg font-semibold text-slate-900 mb-2">Войдите, чтобы продолжить</p>
                <p className="text-sm text-slate-500 mb-5">
                  Для доступа к ИИ-ассистенту необходимо авторизоваться.
                </p>
                <Link href="/auth/login" className="inline-flex items-center justify-center bg-slate-900 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-slate-800 transition-colors shadow-[0_10px_18px_-12px_rgba(15,23,42,0.6)]">
                  Войти
                </Link>
              </div>
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
          className="bg-white/90 hover:bg-white rounded-full p-3 sm:p-4 shadow-[0_12px_32px_-8px_rgba(15,118,110,0.45)] hover:shadow-[0_16px_40px_-10px_rgba(15,118,110,0.55)] ring-1 ring-black/5 transition-all duration-300 flex items-center justify-center group backdrop-blur"
          aria-label="Открыть чат с ассистентом"
        >
          <Image 
            src="/ai.svg" 
            alt="AI Assistant" 
            width={24} 
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
          />
        </button>
      ) : (
        <div className="relative w-[94vw] sm:w-[440px] max-w-[94vw] h-[600px] rounded-[28px] bg-white/75 text-slate-900 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.35)] overflow-hidden border border-white/60 animate-fade-in backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-orange-50/40"></div>
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="relative z-10 flex h-full flex-col">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => setShowChatsList(!showChatsList)}>
                  <div className="h-11 w-11 rounded-2xl bg-orange-300/70 p-[1px]">
                    <div className="h-full w-full rounded-2xl bg-white flex items-center justify-center">
                      <Image 
                        src="/ai.svg" 
                        alt="AI Assistant" 
                        width={22} 
                        height={22}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Assistant</div>
                    <div className="text-base font-semibold truncate">{currentChatTitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-white/70 p-1 ring-1 ring-black/5 shadow-[0_8px_20px_-12px_rgba(15,23,42,0.2)]">
                  <button
                    onClick={() => loadChats(false)}
                    className="h-9 w-9 rounded-full hover:bg-orange-50 transition-colors"
                    aria-label="Обновить список чатов"
                  >
                    <IoReloadOutline className="mx-auto h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCreateNewChat}
                    className="h-9 w-9 rounded-full hover:bg-orange-50 transition-colors"
                    aria-label="Создать новый чат"
                  >
                    <IoAddOutline className="mx-auto h-4 w-4" />
                  </button>
                  <button
                    onClick={closeAssistant}
                    className="h-9 w-9 rounded-full hover:bg-orange-50 transition-colors"
                    aria-label="Закрыть чат"
                  >
                    <IoClose className="mx-auto h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 px-3 pb-3">
              <div className="h-full rounded-2xl bg-white/90 text-slate-900 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.35)] border border-white/70 overflow-hidden flex flex-col backdrop-blur">
                {showChatsList && (
                  <div className="absolute inset-0 z-20 bg-white">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                      <div className="text-sm font-semibold">Все чаты</div>
                      <button
                        onClick={() => setShowChatsList(false)}
                        className="h-8 w-8 rounded-full hover:bg-slate-100 transition-colors"
                        aria-label="Закрыть список чатов"
                      >
                        <IoClose className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                    {chats.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-slate-500">
                        Нет сохраненных чатов. Начните новый разговор.
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-200">
                        {chats.map(chat => (
                          <li
                            key={chat.id}
                            className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors ${currentChatId === chat.id ? 'bg-slate-100 border-l-2 border-orange-500' : ''}`}
                            onClick={() => handleSelectChat(chat.id)}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{chat.title}</p>
                              {chat.lastMessage && (
                                <p className="text-xs text-slate-500 truncate mt-1">{chat.lastMessage}</p>
                              )}
                              {chat.lastTimestamp && (
                                <p className="text-[11px] text-slate-400 mt-1">{formatChatTime(chat.lastTimestamp)}</p>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-full transition-colors"
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

                <div className="flex-1 px-4 py-3 overflow-y-auto flex flex-col gap-3 bg-white">
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 shadow-[0_8px_18px_-14px_rgba(244,63,94,0.6)]">
                      <div className="flex justify-between items-start gap-3">
                        <p className="text-rose-700 text-sm">{error}</p>
                        <button
                          onClick={clearError}
                          className="text-rose-400 hover:text-rose-600"
                        >
                          <IoClose className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {(messages.length === 0 || (messages.length === 1 && messages[0].id === 'initial-greeting')) && !isLoading ? (
                    <div className="my-auto text-center">
                      <p className="text-sm text-slate-500">
                        Помогу с расчётами материалов, подбором решений и советами по ремонту.
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-orange-50 text-xs text-orange-700 ring-1 ring-orange-200">Сколько цемента нужно?</span>
                        <span className="px-3 py-1.5 rounded-full bg-orange-50 text-xs text-orange-700 ring-1 ring-orange-200">Как рассчитать кирпич?</span>
                        <span className="px-3 py-1.5 rounded-full bg-orange-50 text-xs text-orange-700 ring-1 ring-orange-200">Выбор утеплителя</span>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={msg.id || index}
                        className={`${msg.isUser
                          ? 'ml-auto bg-orange-500 text-white rounded-2xl rounded-br-md shadow-[0_12px_24px_-14px_rgba(249,115,22,0.55)]'
                          : 'mr-auto bg-white border border-slate-200 rounded-2xl rounded-bl-md shadow-[0_12px_24px_-16px_rgba(15,23,42,0.25)]'
                          } px-3.5 py-3 max-w-[85%]`}
                      >
                        <div className="text-sm whitespace-pre-wrap break-words">{msg.text}</div>
                        <div className={`text-[10px] mt-1 ${msg.isUser ? 'text-white/70' : 'text-slate-400'}`}>
                          {msg.isUser ? 'Вы' : 'Ассистент'} • {formatMessageTime(msg.timestamp)}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                  <div className="mr-auto bg-white border border-slate-200 rounded-2xl rounded-bl-md shadow-[0_12px_24px_-16px_rgba(15,23,42,0.25)] px-3.5 py-3 max-w-[85%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-slate-200 p-3 bg-white/90">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Введите сообщение..."
                      disabled={isLoading}
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!userMessage.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-orange-500 text-white disabled:bg-orange-200 transition-colors shadow-[0_8px_16px_-10px_rgba(249,115,22,0.55)]"
                    >
                      <IoSendOutline className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
