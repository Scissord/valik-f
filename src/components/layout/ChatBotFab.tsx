'use client';

import Link from 'next/link';
import { IoChatbubblesOutline } from 'react-icons/io5';

export function ChatBotFab() {
  return (
    <Link
      href="/"
      className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 no-underline group"
      aria-label="Открыть чат-бот"
    >
      {/* 3D выпуклая кнопка: градиент + тени создают объём */}
      <span
        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-white text-sm
          bg-gradient-to-b from-orange-400 via-orange-500 to-amber-600
          border border-orange-300
          shadow-[0_4px_0_0_rgba(194,65,12,0.8),0_6px_12px_rgba(0,0,0,0.15)]
          transition-all duration-200 ease-out
          group-hover:shadow-[0_6px_0_0_rgba(194,65,12,0.8),0_8px_16px_rgba(0,0,0,0.2)]
          group-hover:-translate-y-0.5
          group-active:translate-y-[2px]
          group-active:shadow-[0_2px_0_0_rgba(194,65,12,0.8),0_2px_6px_rgba(0,0,0,0.15)]"
      >
        <IoChatbubblesOutline className="w-5 h-5 shrink-0" />
        <span>Чат-бот</span>
      </span>
    </Link>
  );
}
