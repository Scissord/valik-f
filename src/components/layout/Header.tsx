"use client";

import { useCartStore, useUserStore } from "@/lib/legacy";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, User, MessageCircle } from "lucide-react";
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

  useEffect(() => {
    setLoaded(true);
    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 10);
    }, 50);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 bg-white transition-all duration-300 ${isScrolled ? "shadow-sm" : "shadow-none"
        }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Search — desktop */}
          <div className="flex-1 hidden md:flex justify-center">
            <Search />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile: search + AI link */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                href="/"
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/30 text-[#36373d] hover:text-orange-500 transition-colors"
                aria-label="Открыть AI Ассистент"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Search isMobile={true} />
            </div>

            {/* Cart — desktop */}
            <Link
              href="/cart"
              className="hidden md:flex items-center gap-2 transition-colors duration-200 group"
            >
              <div className="relative flex items-center justify-center">
                {loaded && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-orange-500 text-white font-medium">
                    {totalItems}
                  </span>
                )}
                <ShoppingCart className="w-5 h-5 text-[#36373d] group-hover:text-orange-500 transition-colors" />
              </div>
              <span className="text-sm text-[#36373d] group-hover:text-orange-500 transition-colors">
                Корзина
              </span>
            </Link>

            {/* Profile — desktop */}
            <Link
              href={user ? "/profile" : "/auth/login"}
              className="hidden md:flex items-center gap-2 transition-colors duration-200 group"
            >
              <User className="w-5 h-5 text-[#36373d] group-hover:text-orange-500 transition-colors" />
              <span className="text-sm text-[#36373d] group-hover:text-orange-500 transition-colors">
                {user ? "Профиль" : "Войти"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
