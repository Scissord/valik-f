"use client";

import { useCartStore, useUIStore, useUserStore } from "@/store";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { IoCartOutline, IoMenuOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import Logo from "./logo";
import Search from "./search";
import { useShallow } from 'zustand/react/shallow';

// Функция для debounce
const debounce = (fn: Function, ms = 100) => {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

export const Header = () => {
  // Используем useShallow для предотвращения лишних ререндеров
  const totalItems = useCartStore(state => state.getTotalItems());
  const { openMenu, isSideMenuOpen } = useUIStore(
    useShallow(state => ({
      openMenu: state.openSideMenu,
      isSideMenuOpen: state.isSideMenuOpen
    }))
  );

  const user = useUserStore(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Мемоизируем обработчик прокрутки с debounce
  const handleScroll = useCallback(
    debounce(() => {
      setIsScrolled(window.scrollY > 10);
    }, 50),
    []
  );

  useEffect(() => {
    setLoaded(true);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300
      ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-md py-4'}
      ${isSideMenuOpen ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Навигация - скрыта на мобильных */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              className="px-3 py-2 text-gray-700 font-medium hover:text-[#fc640c] transition-colors duration-200"
              href="/products"
            >
              Магазин
            </Link>
            <Link
              className="px-3 py-2 text-gray-700 font-medium hover:text-[#fc640c] transition-colors duration-200"
              href="/about"
            >
              О сервисе
            </Link>
            <Link
              className="px-3 py-2 text-gray-700 font-medium hover:text-[#fc640c] transition-colors duration-200"
              href="/contacts"
            >
              Контакты
            </Link>
          </nav>

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            {/* Поиск */}
            <div className="hidden md:block mr-2">
              <Search />
            </div>

            {/* Поиск (мобильный) */}
            <Link href="/search" className={`md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${isSideMenuOpen ? 'pointer-events-none' : ''}`}>
              <IoSearchOutline className="w-5 h-5 text-gray-700" />
            </Link>

            {/* Корзина */}
            <Link href={totalItems === 0 && loaded ? "/empty" : "/cart"} className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${isSideMenuOpen ? 'pointer-events-none' : ''}`}>
              <div className="relative">
                {loaded && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-[#fc640c] text-white font-medium">
                    {totalItems}
                  </span>
                )}
                <IoCartOutline className="w-5 h-5 text-gray-700" />
              </div>
            </Link>

            {/* Профиль */}
            <Link
              href={user ? "/profile" : "/auth/login"}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${isSideMenuOpen ? 'pointer-events-none' : ''}`}
            >
              <IoPersonOutline className="w-5 h-5 text-gray-700" />
            </Link>

            {/* Меню - для мобильных */}
            <button
              onClick={openMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Открыть меню"
              disabled={isSideMenuOpen}
            >
              <IoMenuOutline className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
