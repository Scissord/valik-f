"use client";

import { useCartStore, useUserStore } from "@/lib/legacy";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { IoCartOutline, IoPersonOutline, IoLogoWhatsapp } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa6";
import Logo from "./logo";
import Search from "./search";

// Простая реализация debounce
const debounce = (fn: (...args: any[]) => void, ms = 100) => {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
};

export const Header = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const user = useUserStore((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleScroll = useCallback(() => {
    const debounced = debounce(() => {
      setIsScrolled(window.scrollY > 10);
    }, 50);
    debounced();
  }, []);

  useEffect(() => {
    setLoaded(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const headerBgClass = isHomePage ? "bg-white" : "bg-white";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${headerBgClass} shadow-none`}
    >
      <div
        className={`bg-white border-b border-gray-200 overflow-hidden transition-all duration-300 max-h-20 opacity-100 ${isScrolled
          ? "md:max-h-0 md:opacity-0"
          : "md:max-h-20 md:opacity-100"
          }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3 py-2 text-xs sm:text-sm">
            <nav className="flex items-center gap-4">
              <Link
                className="text-gray-700 font-medium hover:text-[#fc640c] transition-colors duration-200"
                href="/about"
              >
                О сервисе
              </Link>
              <Link
                className="text-gray-700 font-medium hover:text-[#fc640c] transition-colors duration-200"
                href="/contacts"
              >
                Контакты
              </Link>
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="https://t.me/Valikkzbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-[#fc640c] transition-colors duration-200"
                aria-label="Открыть Telegram-бота Valik.kz"
              >
                <FaTelegram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://wa.me/77758616810"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-[#fc640c] transition-colors duration-200"
                aria-label="Открыть WhatsApp"
              >
                <IoLogoWhatsapp className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="tel:+77758616810"
                className="text-gray-800 font-medium hover:text-[#fc640c] transition-colors duration-200"
              >
                +7 (775) 861-68-10
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 transition-all duration-300">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-1.5">
            <div className="flex-shrink-0">
              <Logo />
            </div>

            <div className="flex-1 flex justify-center px-4">
              <div className="hidden md:flex justify-center w-full">
                <Search />
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-6 md:flex-none">
              <div className="md:hidden">
                <Search isMobile={true} />
              </div>

              <Link
                href="/cart"
                className="hidden md:flex items-center gap-2 transition-colors duration-200 group"
              >
                <div className="relative flex items-center justify-center">
                  {loaded && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-[#fc640c] text-white font-medium">
                      {totalItems}
                    </span>
                  )}
                  <IoCartOutline className="w-5 h-5 text-gray-700 group-hover:text-[#fc640c]" />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-[#fc640c]">
                  Корзина
                </span>
              </Link>

              <Link
                href={user ? "/profile" : "/auth/login"}
                className="hidden md:flex items-center gap-2 transition-colors duration-200 group"
              >
                <IoPersonOutline className="w-5 h-5 text-gray-700 group-hover:text-[#fc640c]" />
                <span className="text-sm text-gray-700 group-hover:text-[#fc640c]">
                  {user ? "Профиль" : "Войти"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
