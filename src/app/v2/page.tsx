'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoSparkles, IoMenuOutline, IoCloseOutline, IoAddCircleOutline, IoTrashBinOutline, IoStorefront } from 'react-icons/io5';
import Link from 'next/link';
import Image from 'next/image';
import { useAIAssistant } from '@/components/features/ai-assistant/ai-context';
import { useUserStore, formatMessageTime, formatChatTime } from '@/lib/legacy';

export default function AIHomePageV2() {
    const {
        messages,
        chats,
        currentChatId,
        isLoading,
        sendMessage,
        loadChats,
        loadChatHistory,
        createNewChat,
        deleteChat
    } = useAIAssistant();

    const user = useUserStore((state) => state.user);
    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (msg?: string) => {
        const textToSend = typeof msg === 'string' ? msg : inputValue;
        if (!textToSend.trim() || isLoading) return;
        if (typeof msg !== 'string') setInputValue('');
        await sendMessage(textToSend);
    };

    const quickActions = [
        { icon: "🏗️", text: "Рассчитать материалы" },
        { icon: "🔍", text: "Найти товар" },
        { icon: "📋", text: "Составить смету" },
        { icon: "💡", text: "Консультация" }
    ];

    return (
        <div
            className="min-h-screen text-gray-800 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 25%, #fed7aa 50%, #fdba74 100%)' }}
        >
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-200/20 to-amber-100/20 rounded-full blur-3xl" />
            </div>

            {/* Top Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between backdrop-blur-xl bg-white/70 rounded-2xl px-6 py-3 border border-orange-200/50 shadow-lg shadow-orange-100/50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-orange-100 rounded-xl transition-colors"
                        >
                            {isMenuOpen ? <IoCloseOutline className="w-6 h-6 text-orange-700" /> : <IoMenuOutline className="w-6 h-6 text-orange-700" />}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                                <IoSparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-gray-800">Valik AI</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/market"
                            className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-xl transition-colors text-sm font-medium text-gray-700 border border-orange-200"
                        >
                            <IoStorefront className="w-4 h-4 text-orange-600" />
                            <span className="hidden sm:inline">Магазин</span>
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border border-orange-300">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-xs font-bold text-white">
                                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm hidden sm:inline text-gray-700">{user.full_name}</span>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all text-sm font-medium text-white shadow-lg shadow-orange-300/50"
                            >
                                Войти
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Slide-out Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -400, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-80 z-50 bg-white/95 backdrop-blur-xl border-r border-orange-100 flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-orange-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">История чатов</h2>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 hover:bg-orange-100 rounded-xl transition-colors"
                                    >
                                        <IoCloseOutline className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => { createNewChat(); setIsMenuOpen(false); }}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all font-medium text-white shadow-lg shadow-orange-200"
                                >
                                    <IoAddCircleOutline className="w-5 h-5" />
                                    Новый чат
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                                {chats.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">
                                        <IoSparkles className="w-10 h-10 mx-auto mb-3 opacity-50 text-orange-300" />
                                        <p>Нет сохранённых чатов</p>
                                    </div>
                                ) : (
                                    chats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => { loadChatHistory(chat.id); setIsMenuOpen(false); }}
                                            className={`w-full text-left p-4 rounded-xl transition-all group ${currentChatId === chat.id
                                                ? 'bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300'
                                                : 'hover:bg-orange-50 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate text-gray-800">{chat.title || 'Новый чат'}</div>
                                                    <div className="text-xs text-gray-400 truncate mt-1">{chat.lastMessage || 'Пустой чат'}</div>
                                                </div>
                                                {currentChatId === chat.id && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                                                        className="p-1 hover:bg-red-100 rounded text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <IoTrashBinOutline className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="relative min-h-screen flex flex-col pt-24 pb-32">
                <div className="flex-1 max-w-4xl mx-auto w-full px-4 overflow-y-auto">

                    {/* Empty State */}
                    {messages.length <= 1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 mx-auto mb-8 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl opacity-50 blur-xl" />
                                <div className="relative w-full h-full bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-300/50">
                                    <IoSparkles className="w-12 h-12 text-white" />
                                </div>
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                                Привет! Я Valik AI
                            </h1>
                            <p className="text-lg text-gray-600 max-w-md mx-auto mb-12">
                                Ваш умный помощник по строительству и ремонту. Задайте любой вопрос!
                            </p>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                                {quickActions.map((action, idx) => (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handleSendMessage(action.text)}
                                        className="flex items-center gap-2 px-5 py-3 bg-white/80 hover:bg-white border border-orange-200 hover:border-orange-400 rounded-2xl transition-all group shadow-sm hover:shadow-md"
                                    >
                                        <span className="text-xl">{action.icon}</span>
                                        <span className="font-medium text-gray-700 group-hover:text-orange-600">{action.text}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Messages */}
                    <div className="space-y-6 py-4">
                        {messages.filter(m => m.id !== 'initial-greeting' || messages.length === 1).map((msg, idx) => (
                            <motion.div
                                key={msg.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {!msg.isUser && (
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-200">
                                        <IoSparkles className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] ${msg.isUser ? 'order-first' : ''}`}>
                                    <div className={`
                                        p-4 rounded-2xl text-base leading-relaxed
                                        ${msg.isUser
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-sm shadow-lg shadow-orange-200'
                                            : 'bg-white/90 backdrop-blur-sm border border-orange-100 text-gray-800 rounded-tl-sm shadow-sm'
                                        }
                                    `}>
                                        {msg.text}
                                    </div>
                                    <div className={`text-xs text-gray-400 mt-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                                        {formatMessageTime(msg.timestamp)}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-4 justify-start"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-200">
                                    <IoSparkles className="w-5 h-5 text-white animate-pulse" />
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm border border-orange-100 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                                    </div>
                                    <span className="text-gray-400 text-sm ml-2">Думаю...</span>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="fixed bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, #ffedd5 0%, rgba(255,237,213,0.9) 50%, transparent 100%)' }}>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative backdrop-blur-xl bg-white/90 rounded-2xl border border-orange-200 p-2 shadow-xl shadow-orange-100/50">
                            <div className="flex items-end gap-2">
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Напишите сообщение..."
                                    rows={1}
                                    className="flex-1 bg-transparent border-none outline-none resize-none py-3 px-4 text-gray-800 placeholder:text-gray-400 max-h-32"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputValue.trim() || isLoading}
                                    className={`p-3 rounded-xl transition-all duration-300 ${inputValue.trim() && !isLoading
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-200 hover:scale-105 active:scale-95'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <IoSend className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            AI может ошибаться. Проверяйте важную информацию.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
