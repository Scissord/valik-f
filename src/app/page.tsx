'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoMenuOutline, IoCloseOutline, IoAddCircleOutline, IoTrashBinOutline, IoStorefront } from 'react-icons/io5';
import Link from 'next/link';
import Image from 'next/image';
import { useAIAssistant } from '@/components/features/ai-assistant/ai-context';
import { useUserStore, formatMessageTime } from '@/lib/legacy';

export default function AIHomePage() {
    const {
        messages,
        chats,
        currentChatId,
        isLoading,
        sendMessage,
        loadChatHistory,
        createNewChat,
        deleteChat
    } = useAIAssistant();

    const user = useUserStore((state) => state.user);
    const [inputValue, setInputValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [borderAngle, setBorderAngle] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const inputWrapRef = useRef<HTMLDivElement>(null);

    const handleInputWrapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = inputWrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;
        setBorderAngle(angle);
    };

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
        <div className="min-h-screen min-w-full text-gray-800 overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200" style={{ backgroundAttachment: 'fixed' }}>

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
                        <Image src="/logo.svg" alt="Valik.kz" width={100} height={32} className="h-8 w-auto" />
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
                                        <Image src="/logo.svg" alt="" width={80} height={26} className="h-10 w-auto mx-auto mb-3 opacity-50" />
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
                            <div className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl opacity-50 blur-xl" />
                                <div className="relative w-full h-full bg-white/90 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-300/50 p-3">
                                    <Image src="/logo.svg" alt="Valik.kz" width={72} height={72} className="w-full h-full object-contain" />
                                </div>
                            </div>

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
                                    <div className="w-10 h-10 rounded-2xl bg-white flex-shrink-0 flex items-center justify-center shadow-lg border border-orange-100 overflow-hidden p-1">
                                        <Image src="/logo.svg" alt="" width={36} height={36} className="w-full h-full object-contain" />
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
                                <div className="w-10 h-10 rounded-2xl bg-white flex-shrink-0 flex items-center justify-center shadow-lg border border-orange-100 overflow-hidden p-1 animate-pulse">
                                    <Image src="/logo.svg" alt="" width={36} height={36} className="w-full h-full object-contain" />
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
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-orange-200/90 via-amber-100/70 to-transparent">
                    <div className="max-w-3xl mx-auto">
                        <div
                            ref={inputWrapRef}
                            onMouseMove={handleInputWrapMouseMove}
                            onMouseLeave={() => setBorderAngle(0)}
                            className="relative rounded-2xl p-[2px] shadow-xl shadow-orange-100/50 transition-[background] duration-150"
                            style={{
                                background: `conic-gradient(from ${borderAngle}deg at 50% 50%, #ea580c, #fb923c, #fdba74, #f97316, #ea580c)`,
                            }}
                        >
                            <div className="relative flex items-end gap-2 rounded-[14px] bg-white/95 backdrop-blur-xl py-2 px-2">
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
