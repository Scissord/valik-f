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
      {/* Минималистичная плоская кнопка */}
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-full font-semibold text-white
          bg-orange-500 shadow-md hover:shadow-lg hover:bg-orange-600 outline-none
          transition-all duration-200 ease-out
          hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
      >
        <IoChatbubblesOutline className="w-6 h-6 shrink-0" />
      </span>
    </Link>
  );
}
