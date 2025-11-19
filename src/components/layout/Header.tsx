"use client";

import { useCartStore, useUserStore } from "@/lib/legacy";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { IoCartOutline, IoPersonOutline } from "react-icons/io5";
import Logo from "./logo";
import Search from "./search";
import { MobileCategoryMenu } from "./MobileCategoryMenu";

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
  const [_isScrolled, setIsScrolled] = useState(false);
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
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${headerBgClass} py-1 border-b border-gray-200 shadow-none`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex-1 md:flex-none md:order-3">
            <div className="flex items-center justify-end space-x-2 md:space-x-4">
              <div className="hidden md:block">
                <Search />
              </div>

              <div className="md:hidden">
                <Search isMobile={true} />
              </div>

              <MobileCategoryMenu />

              <Link
                href="/cart"
                className="hidden md:block transition-colors duration-200 group"
              >
                <div className="relative flex items-center justify-center">
                  {loaded && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-[#fc640c] text-white font-medium">
                      {totalItems}
                    </span>
                  )}
                  <IoCartOutline className="w-5 h-5 text-gray-700 group-hover:text-[#fc640c]" />
                </div>
              </Link>

              <Link
                href={user ? "/profile" : "/auth/login"}
                className="hidden md:block transition-colors duration-200 group"
              >
                <IoPersonOutline className="w-5 h-5 text-gray-700 group-hover:text-[#fc640c]" />
              </Link>
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
                className="px-3 py-1 text-gray-700 font-medium hover:text-[#fc640c] transition-colors	duration-200"
                href="/contacts"
              >
                Контакты
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
