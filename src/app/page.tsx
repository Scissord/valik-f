'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoArrowForward, IoChatbubblesOutline, IoStorefrontOutline, IoAdd, IoTimeOutline, IoTrashOutline, IoSparkles, IoFlash, IoRocket, IoConstruct } from 'react-icons/io5';
import Link from 'next/link';
import Image from 'next/image';
import { useAIAssistant } from '@/components/features/ai-assistant/ai-context';
import { useUserStore, formatMessageTime, formatChatTime } from '@/lib/legacy';

export default function AIHomePage() {
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize sidebar state based on screen size
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsSidebarOpen(window.innerWidth >= 1024);
        }
    }, []);

    // Track mouse for interactive background
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (msg?: string) => {
        const textToSend = typeof msg === 'string' ? msg : inputValue;
        if (!textToSend.trim() || isLoading) return;

        // Clear input immediately for better UX if it was typed
        if (typeof msg !== 'string') setInputValue('');

        await sendMessage(textToSend);
    };

    // Quick prompt suggestions with icons
    const suggestions = [
        { icon: IoConstruct, text: "Помоги рассчитать фундамент", color: "from-blue-500 to-cyan-500" },
        { icon: IoFlash, text: "Какой утеплитель лучше?", color: "from-yellow-500 to-orange-500" },
        { icon: IoRocket, text: "Собери корзину для ремонта", color: "from-purple-500 to-pink-500" },
        { icon: IoSparkles, text: "Как правильно клеить обои?", color: "from-green-500 to-emerald-500" }
    ];

    return (
        <div className="flex h-screen overflow-hidden font-sans relative bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50">

            {/* Interactive Background Gradient that follows mouse */}
            <div
                className="fixed inset-0 pointer-events-none transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251,146,60,0.15), transparent 40%)`,
                }}
            />

            {/* Animated floating shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-orange-200/40 to-amber-200/40 rounded-3xl blur-xl"
                />
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -10, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-orange-300/30 to-red-200/30 rounded-full blur-2xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-full blur-3xl"
                />
            </div>

            {/* Sidebar (History) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="fixed inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-xl border-r border-orange-100 flex flex-col shadow-2xl lg:shadow-none lg:static"
                    >
                        <div className="p-4 border-b border-orange-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 px-2">
                                <Image
                                    src="/logo.svg"
                                    alt="Valik.kz"
                                    width={120}
                                    height={40}
                                    priority
                                    className="h-10 w-auto"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => createNewChat()}
                                className="p-2 hover:bg-orange-100 rounded-full transition-colors"
                                title="Новый чат"
                            >
                                <IoAdd className="w-5 h-5 text-orange-600" />
                            </motion.button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin">
                            <div className="px-2 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <IoTimeOutline className="w-3 h-3" />
                                История
                            </div>
                            {chats.map((chat, index) => (
                                <motion.button
                                    key={chat.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => loadChatHistory(chat.id)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all group ${currentChatId === chat.id
                                        ? 'bg-gradient-to-r from-orange-100 to-amber-50 text-orange-900 shadow-sm border border-orange-200'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentChatId === chat.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <IoChatbubblesOutline className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="truncate text-sm font-medium">{chat.title || 'Новый чат'}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-[10px] text-gray-400 truncate max-w-[100px]">
                                                {chat.lastMessage || 'Нет сообщений'}
                                            </span>
                                            {chat.lastTimestamp && (
                                                <span className="text-[10px] text-gray-300">
                                                    {formatChatTime(chat.lastTimestamp)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {currentChatId === chat.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                                            className="p-1 hover:bg-red-100 rounded text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <IoTrashOutline className="w-3 h-3" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            ))}
                            {chats.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    <IoChatbubblesOutline className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    История пуста
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-orange-50">
                            {user ? (
                                <div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-200">
                                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate text-gray-800">{user.full_name}</div>
                                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/auth/login" className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all text-sm font-medium shadow-lg shadow-orange-200">
                                    <IoSparkles className="w-4 h-4" />
                                    Войти
                                </Link>
                            )}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative h-full">
                {/* Header Overlay */}
                <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-white/90 via-white/60 to-transparent backdrop-blur-sm">
                    <div className="mr-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-xl hover:bg-orange-100 transition-colors bg-white/80 shadow-sm border border-orange-100"
                        >
                            <IoChatbubblesOutline className="w-6 h-6 text-orange-600" />
                        </motion.button>
                    </div>
                    <div className="ml-auto">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/market"
                                className="group flex items-center gap-2 bg-white/90 backdrop-blur-md border border-orange-200 hover:border-orange-400 shadow-lg hover:shadow-xl px-5 py-2.5 rounded-full transition-all duration-300"
                            >
                                <IoStorefrontOutline className="w-5 h-5 text-orange-500 group-hover:text-orange-600 transition-colors" />
                                <span className="font-medium text-gray-700 group-hover:text-orange-600 text-sm">Перейти в магазин</span>
                                <IoArrowForward className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </header>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto px-4 pt-24 pb-40 md:px-20 lg:px-40 xl:px-60 scroll-smooth scrollbar-hide">
                    <div className="max-w-4xl mx-auto space-y-6">

                        {/* Welcome / Empty State */}
                        {messages.length <= 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-10 md:py-16"
                            >
                                {/* Animated AI Icon */}
                                <motion.div
                                    className="relative w-28 h-28 mx-auto mb-8"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 rounded-[2rem] blur-xl opacity-60" />
                                    <motion.div
                                        className="relative w-full h-full bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-[2rem] flex items-center justify-center shadow-2xl"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <IoSparkles className="w-14 h-14 text-white drop-shadow-lg" />
                                        </motion.div>
                                    </motion.div>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
                                >
                                    Привет! Я <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Valik AI</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-500 max-w-lg mx-auto mb-12 text-lg"
                                >
                                    Ваш персональный AI-ассистент. Помогу выбрать материалы, рассчитать смету или найти нужный товар.
                                </motion.p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                    {suggestions.map((suggestion, idx) => (
                                        <motion.button
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSendMessage(suggestion.text)}
                                            className="p-4 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50 transition-all text-left group flex items-center gap-4"
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${suggestion.color} flex items-center justify-center shadow-lg`}>
                                                <suggestion.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-gray-700 font-medium group-hover:text-orange-600 transition-colors flex-1">{suggestion.text}</span>
                                            <IoArrowForward className="w-4 h-4 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Chat Messages */}
                        {messages.filter(m => m.id !== 'initial-greeting' || messages.length === 1).map((msg, idx) => (
                            <motion.div
                                key={msg.id || idx}
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`flex gap-4 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                {!msg.isUser && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-200"
                                    >
                                        <IoSparkles className="w-5 h-5 text-white" />
                                    </motion.div>
                                )}
                                <div className={`max-w-[85%] md:max-w-[75%] space-y-1 ${msg.isUser ? 'items-end flex flex-col' : ''}`}>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`
                                            p-4 rounded-2xl shadow-sm text-base leading-relaxed
                                            ${msg.isUser
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-sm shadow-lg shadow-orange-200'
                                                : 'bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-800 rounded-tl-sm'
                                            }
                                        `}
                                    >
                                        {msg.text}
                                    </motion.div>
                                    <span className="text-[11px] text-gray-400 px-1 opacity-70">
                                        {msg.isUser ? 'Вы' : 'AI Assistant'} • {formatMessageTime(msg.timestamp)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-4 justify-start"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-200">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                        <IoSparkles className="w-5 h-5 text-white" />
                                    </motion.div>
                                </div>
                                <div className="bg-white/90 backdrop-blur border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-2 h-2 bg-orange-400 rounded-full" />
                                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-2 h-2 bg-amber-400 rounded-full" />
                                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-orange-400 rounded-full" />
                                    </div>
                                    <span className="text-gray-400 text-sm">Думаю...</span>
                                </div>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white via-white/95 to-transparent">
                    <div className="max-w-3xl mx-auto relative">
                        <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 rounded-3xl opacity-30 blur-xl"
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-orange-100 flex items-end p-2 md:p-3 overflow-hidden">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Спросите о товарах, ремонте или строительстве..."
                                className="w-full max-h-32 min-h-[50px] bg-transparent border-none outline-none focus:outline-none focus:ring-0 ring-0 resize-none py-3 px-3 text-gray-700 placeholder:text-gray-400 font-medium leading-relaxed"
                                disabled={isLoading}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSendMessage()}
                                disabled={!inputValue.trim() || isLoading}
                                className={`
                                    mb-1 mr-1 p-3 rounded-xl flex items-center justify-center transition-all duration-300
                                    ${inputValue.trim() && !isLoading
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 hover:shadow-xl'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                                `}
                            >
                                <IoSend className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="text-center mt-3">
                            <p className="text-xs text-gray-400 font-medium">AI может допускать ошибки. Проверяйте информацию о товарах.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
