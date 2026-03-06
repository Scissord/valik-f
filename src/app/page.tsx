'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoCalculatorOutline, IoSearchOutline, IoDocumentTextOutline, IoBulbOutline } from 'react-icons/io5';
import { HiBars3BottomLeft, HiOutlineShoppingBag, HiXMark, HiPlus, HiOutlineTrash } from 'react-icons/hi2';
import { Plus, ArrowUpRight, PanelLeft, Hand } from 'lucide-react';
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
        { icon: <IoCalculatorOutline />, title: "Расчёт материалов", subtitle: "Стройматериалы" },
        { icon: <IoSearchOutline />, title: "Подобрать товары", subtitle: "Каталог Valik.kz" },
        { icon: <IoDocumentTextOutline />, title: "Составить смету", subtitle: "Бюджет ремонта" },
    ];

    const hasUserMessages = messages.some(m => m.isUser);

    return (
        <div className="min-h-screen text-zinc-900 font-sans selection:bg-orange-100 transition-colors" style={{ background: 'radial-gradient(ellipse at 75% 0%, rgba(251,146,60,0.40) 0%, rgba(253,186,116,0.20) 45%, rgba(255,255,255,0) 75%), radial-gradient(ellipse at 25% 100%, rgba(251,146,60,0.20) 0%, rgba(255,237,213,0.15) 40%, rgba(255,255,255,0) 70%), radial-gradient(ellipse at 50% 50%, rgba(255,237,213,0.15) 0%, rgba(255,255,255,0) 80%), #ffffff' }}>
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
                            initial={{ x: -296 }}
                            animate={{ x: 0 }}
                            exit={{ x: -296 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-2 sm:left-4 top-2 sm:top-4 bottom-2 sm:bottom-4 w-[280px] z-50 bg-white border border-zinc-100 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-zinc-50 flex items-center justify-between">
                                <span className="font-semibold text-sm tracking-tight">История чатов</span>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-zinc-50 rounded-lg">
                                    <HiXMark className="text-xl" />
                                </button>
                            </div>

                            <div className="p-4 flex justify-center border-b border-zinc-50/50">
                                <button
                                    onClick={() => { createNewChat(); setIsMenuOpen(false); }}
                                    className="w-full py-2.5 px-4 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-all shadow-[0_2px_8px_-2px_rgba(249,115,22,0.6)] active:scale-[0.98] flex items-center justify-center gap-2"
                                    title="Создать новый чат"
                                >
                                    <HiPlus className="text-lg stroke-2" />
                                    <span>Создать новый чат</span>
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
            <header className="sticky top-0 z-30 bg-transparent flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                    {/* Sidebar toggle — только на мобиле */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="sm:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-white/30 text-[#36373d] hover:text-orange-500 transition-colors backdrop-blur-sm"
                    >
                        <PanelLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tight text-orange-500" style={{ fontFamily: 'var(--font-title)' }}>Valik <span className="font-semibold">AI</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/market" className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/30 text-[#36373d] hover:text-orange-500 transition-colors backdrop-blur-sm">
                        <HiOutlineShoppingBag className="text-xl" />
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-2 p-1 pl-3 pr-1 bg-zinc-50 border border-zinc-100 rounded-full">
                            <span className="text-xs font-medium text-zinc-600">{user.name?.split(' ')[0]}</span>
                            <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                {user.name?.[0].toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="h-11 px-5 flex items-center rounded-2xl text-white text-sm font-semibold hover:opacity-80 transition-opacity" style={{ backgroundColor: '#36373d' }}>
                            Войти
                        </Link>
                    )}
                </div>
            </header>

            <main className={`max-w-4xl mx-auto w-full flex flex-col px-4 ${hasUserMessages ? 'min-h-[calc(100vh-3.5rem)] pb-32' : ''} overflow-y-auto`}>
                {/* Empty State / Welcome Screen */}
                {!hasUserMessages && (
                    <div className="flex flex-col items-center justify-center pt-12 pb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-16 h-16 flex items-center justify-center rounded-3xl mb-5 shadow-md" style={{ backgroundColor: '#36373d' }}>
                            <Hand className="w-8 h-8 text-white -rotate-[20deg]" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
                            Привет! Чем могу помочь?
                        </h1>
                        <p className="text-zinc-500 text-sm sm:text-base max-w-sm font-medium">
                            Ваш персональный ассистент по стройматериалам и ремонту в Valik.kz
                        </p>
                    </div>
                )}

                {/* Chat History */}
                {hasUserMessages && (
                    <div className="space-y-10 py-6">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg.id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex flex-col max-w-2xl mx-auto w-full group ${msg.isUser ? 'items-end' : 'items-start'}`}
                            >
                                <div className="flex items-center gap-2 mb-1.5 px-1">
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${msg.isUser ? 'text-zinc-400' : 'text-orange-500'}`}>
                                        {msg.isUser ? 'Вы' : 'Valik AI'}
                                    </span>
                                    <span className="text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {formatMessageTime(msg.timestamp)}
                                    </span>
                                </div>
                                <div
                                    className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap max-w-[85%] ${msg.isUser
                                        ? 'text-white font-medium rounded-tr-sm'
                                        : 'bg-white border border-zinc-200 text-zinc-800 font-normal rounded-tl-sm shadow-sm'
                                        }`}
                                    style={msg.isUser ? { backgroundColor: '#36373d' } : {}}
                                >
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
                )}
            </main>

            {/* Sidebar toggle — фиксированный нижний левый угол */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="hidden sm:flex fixed bottom-8 left-4 w-11 h-11 items-center justify-center rounded-2xl bg-white/30 text-[#36373d] hover:text-orange-500 transition-colors backdrop-blur-sm z-20"
            >
                <PanelLeft className="w-6 h-6" />
            </button>

            {/* Quick Action Cards — above input, welcome screen only */}
            {!hasUserMessages && (
                <div className="fixed bottom-[165px] sm:bottom-[165px] left-0 right-0 px-4 z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="max-w-3xl mx-auto">
                        {/* Mobile: vertical list */}
                        <div className="flex flex-col sm:hidden gap-2">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(action.title)}
                                    className="flex flex-row items-center gap-3 px-4 py-3 bg-white border border-zinc-100 rounded-2xl hover:border-orange-200 transition-all text-left shadow-sm group w-full"
                                >
                                    <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-white text-lg" style={{ backgroundColor: '#36373d' }}>
                                        {action.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-zinc-800 leading-snug">{action.title}</div>
                                        <div className="text-[11px] text-zinc-400 mt-0.5">{action.subtitle}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {/* Desktop: 3-col grid */}
                        <div className="hidden sm:grid grid-cols-3 gap-3">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(action.title)}
                                    className="flex flex-col items-start gap-3 p-4 bg-white border border-zinc-100 rounded-2xl hover:border-orange-200 transition-all text-left shadow-sm group"
                                >
                                    <div className="w-9 h-9 flex items-center justify-center rounded-xl text-white text-lg" style={{ backgroundColor: '#36373d' }}>
                                        {action.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-zinc-800 leading-snug group-hover:text-zinc-900">{action.title}</div>
                                        <div className="text-[11px] text-zinc-400 mt-0.5">{action.subtitle}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Input Fixed Area */}
            <div className="fixed bottom-0 left-0 right-0 bg-transparent pt-2 pb-8 px-4">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="flex items-center bg-white rounded-full p-1.5 transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-200/50 overflow-hidden shadow-md border border-zinc-100">
                        <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/30 text-[#36373d] hover:text-orange-500 transition-colors backdrop-blur-sm ml-0.5">
                            <Plus className="w-5 h-5" />
                        </button>

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
                            placeholder="Спросите Valik AI о чем угодно..."
                            rows={1}
                            className="flex-1 bg-transparent border-none outline-none resize-none py-2.5 sm:py-3 pl-3 sm:pl-4 pr-2 text-[15px] sm:text-[16px] text-zinc-800 placeholder:text-zinc-400 max-h-48 scrollbar-none"
                            disabled={isLoading}
                        />

                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading}
                            className={`flex items-center gap-1.5 px-3 sm:px-6 py-2.5 rounded-full font-medium transition-all shrink-0 shadow-sm ${inputValue.trim() && !isLoading
                                ? 'bg-[#E89C86] text-white hover:bg-[#D98770] active:scale-95'
                                : 'bg-[#E89C86]/60 text-white/80 cursor-not-allowed'
                                }`}
                        >
                            <span className="hidden sm:inline">Отправить</span>
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex justify-center mt-3 text-center px-4">
                    <span className="text-[10px] text-zinc-400 font-medium">Valik AI может предоставлять неточную информацию. Проверяйте важные данные.</span>
                </div>
            </div>
        </div >
    );
}
