"use client";

import { useCartStore, useUIStore, useUserStore } from "@/store";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isHomePage = pathname === '/';

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

  const headerBgClass = isHomePage ? 'bg-white' : 'bg-white shadow-md';

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300
      ${headerBgClass} py-1
      ${isSideMenuOpen ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex-1 md:flex-none md:order-3">
            <div className="flex items-center justify-end space-x-2 md:space-x-4">
              {/* Поиск для десктопа */}
              <div className="hidden md:block">
                <Search />
              </div>

              {/* Поиск для мобильных устройств */}
              <div className="md:hidden">
                <Search isMobile={true} />
              </div>

              <Link href={totalItems === 0 && loaded ? "/empty" : "/cart"} className={`hidden md:block p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 ${isSideMenuOpen ? 'pointer-events-none' : ''}`}>
                <div className="relative">
                  {loaded && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-[#fc640c] text-white font-medium">
                      {totalItems}
                    </span>
                  )}
                  <IoCartOutline className="w-5 h-5 text-gray-700" />
                </div>
              </Link>

              <Link
                href={user ? "/profile" : "/auth/login"}
                className={`hidden md:block p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 ${isSideMenuOpen ? 'pointer-events-none' : ''}`}
              >
                <IoPersonOutline className="w-5 h-5 text-gray-700" />
              </Link>

              <button
                onClick={openMenu}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 md:hidden"
                aria-label="Открыть меню"
                disabled={isSideMenuOpen}
              >
                <IoMenuOutline className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 hidden md:flex justify-center px-4 md:flex-none md:order-2">
            <nav className="flex items-center space-x-1">
              <Link
                className="px-3 py-1 text-gray-700 font-medium hover:text-[#fc640c] transition-colors duration-200"
                href="/products"
              >
                Магазин
              </Link>
              <Link
                className="px-3 py-1 text-gray-700 font-medium hover:text-[#fc640c] transition-colors duration-200"
                href="/about"
              >
                О сервисе
              </Link>
              <Link
                className="px-3 py-1 text-gray-700 font-medium hover:text-[#fc640c] transition-colors duration-200"
                href="/contacts"
              >
                Контакты
              </Link>
              <button
                onClick={openMenu}
                className="group flex items-center gap-2 rounded-md bg-gradient-to-r from-[#fc640c] to-[#ff8534] px-4 py-1.5 font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-1px] hover:brightness-105"
                aria-label="Открыть меню"
                disabled={isSideMenuOpen}
              >
                <span>Категории</span>
                <IoMenuOutline className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
