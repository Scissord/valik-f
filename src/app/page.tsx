'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoCalculatorOutline, IoSearchOutline, IoDocumentTextOutline, IoBulbOutline } from 'react-icons/io5';
import { HiBars3BottomLeft, HiOutlineShoppingBag, HiXMark, HiPlus, HiOutlineTrash } from 'react-icons/hi2';
import Link from 'next/link';
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Only scroll if there's actual conversation happening
        if (messages.length > 1 || isLoading) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, isLoading]);

    const handleSendMessage = async (msg?: string) => {
        const textToSend = typeof msg === 'string' ? msg : inputValue;
        if (!textToSend.trim() || isLoading) return;
        if (typeof msg !== 'string') setInputValue('');
        await sendMessage(textToSend);
    };

    const quickActions = [
        { icon: <IoCalculatorOutline />, text: "Рассчитать материалы" },
        { icon: <IoSearchOutline />, text: "Найти товар" },
        { icon: <IoDocumentTextOutline />, text: "Составить смету" },
        { icon: <IoBulbOutline />, text: "Консультация" }
    ];

    const hasUserMessages = messages.some(m => m.isUser);

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-orange-100 transition-colors">
            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-zinc-900/10 backdrop-blur-[2px] z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] z-50 bg-white border-r border-zinc-100 flex flex-col shadow-xl"
                        >
                            <div className="p-4 border-b border-zinc-50 flex items-center justify-between">
                                <span className="font-semibold text-sm tracking-tight">История чатов</span>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-zinc-50 rounded-lg">
                                    <HiXMark className="text-xl" />
                                </button>
                            </div>

                            <div className="p-3 flex justify-center">
                                <button
                                    onClick={() => { createNewChat(); setIsMenuOpen(false); }}
                                    className="p-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all shadow-sm active:scale-95"
                                    title="Новый чат"
                                >
                                    <HiPlus className="text-xl" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                                {chats.length === 0 ? (
                                    <div className="text-center py-20 text-zinc-400 flex flex-col items-center">
                                        <HiOutlineShoppingBag className="text-4xl mb-4 opacity-40" />
                                        <p className="text-sm">История пуста</p>
                                    </div>
                                ) : (
                                    chats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => { loadChatHistory(chat.id); setIsMenuOpen(false); }}
                                            className={`w-full group flex items-center justify-between p-3 rounded-xl transition-all text-left ${currentChatId === chat.id ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
                                        >
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="text-sm font-medium truncate text-zinc-800">{chat.title || 'Без названия'}</div>
                                                <div className="text-[11px] text-zinc-400 truncate mt-0.5">{chat.lastMessage || 'Пустой чат'}</div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                                                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                                            >
                                                <HiOutlineTrash className="text-sm" />
                                            </button>
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-100 h-14 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-zinc-50 rounded-lg transition-colors">
                        <HiBars3BottomLeft className="text-2xl text-zinc-600" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-orange-500">Valik AI</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/market" className="p-2 hover:bg-zinc-50 rounded-lg transition-colors text-zinc-600">
                        <HiOutlineShoppingBag className="text-xl" />
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-2 p-1 pl-3 pr-1 bg-zinc-50 border border-zinc-100 rounded-full">
                            <span className="text-xs font-medium text-zinc-600">{user.full_name?.split(' ')[0]}</span>
                            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                {user.full_name?.[0].toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="text-xs font-semibold px-4 py-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors">
                            Войти
                        </Link>
                    )}
                </div>
            </header>

            <main className={`max-w-4xl mx-auto w-full flex flex-col px-4 min-h-[calc(100vh-3.5rem)] pb-32 overflow-y-auto`}>
                {/* Empty State / Welcome Screen */}
                {!hasUserMessages && (
                    <div className="flex flex-col items-center justify-center pt-12 pb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
                            Привет! Чем могу помочь?
                        </h1>
                        <p className="text-zinc-500 text-sm sm:text-base max-w-sm mb-12 font-medium">
                            Ваш персональный ассистент по стройматериалам и ремонту в Valik.kz
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(action.text)}
                                    className="flex items-center gap-3 p-4 bg-white border border-zinc-200 hover:border-orange-200 hover:bg-orange-50/10 rounded-2xl transition-all text-left group"
                                >
                                    <span className="text-xl text-zinc-400 group-hover:text-orange-500 transition-colors">{action.icon}</span>
                                    <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">{action.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat History */}
                <div className="space-y-10 py-6">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id || idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col max-w-2xl mx-auto w-full group"
                        >
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${msg.isUser ? 'text-zinc-400' : 'text-orange-500'}`}>
                                    {msg.isUser ? 'Вы' : 'Valik AI'}
                                </span>
                                <span className="text-[10px] text-zinc-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    {formatMessageTime(msg.timestamp)}
                                </span>
                            </div>
                            <div className={`
                                text-[15px] leading-relaxed text-zinc-800 whitespace-pre-wrap px-1
                                ${msg.isUser ? 'font-medium' : 'font-normal'}
                            `}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="max-w-2xl mx-auto w-full px-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider animate-pulse">Valik AI думает...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </main>

            {/* Input Fixed Area */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md pt-2 pb-8 px-4">
                <div className="max-w-2xl mx-auto w-full relative">
                    <div className="flex items-center bg-white border border-zinc-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-200 p-1.5 overflow-hidden">
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
                            placeholder="Спросите меня о чем угодно..."
                            rows={1}
                            className="flex-1 bg-transparent border-none outline-none resize-none py-2.5 pl-4 pr-2 text-[16px] text-zinc-800 placeholder:text-zinc-400 max-h-48 scrollbar-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading}
                            className={`p-2.5 rounded-full transition-all shrink-0 ${inputValue.trim() && !isLoading
                                ? 'bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95'
                                : 'bg-zinc-50 text-zinc-300 cursor-not-allowed'
                                }`}
                        >
                            <IoSend className="text-lg" />
                        </button>
                    </div>
                    <div className="flex justify-center mt-3 text-center px-4">
                        <span className="text-[10px] text-zinc-400 font-medium">Valik AI может предоставлять неточную информацию. Проверяйте важные данные.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
