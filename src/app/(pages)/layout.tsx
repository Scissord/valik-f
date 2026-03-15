"use client";

import { Footer, SideBar, Header } from "@/components";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  useEffect(() => {
    // Проверка на наличие элемента 404 страницы
    const checkNotFound = () => {
      const notFoundElement = document.getElementById('page-not-found');
      setIsNotFoundPage(!!notFoundElement);
    };

    const observer = new MutationObserver(checkNotFound);
    observer.observe(document.body, { childList: true, subtree: true });

    checkNotFound();

    return () => observer.disconnect();
  }, [pathname]);

  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/registration";
  const isLandingPage = pathname === "/";

  // Показываем сайдбар и добавляем отступ только на странице списка товаров
  const shouldShowSidebar = pathname === '/products' && !isNotFoundPage;

  const mainPaddingClass = isAuthPage || isNotFoundPage
    ? ""
    : isLandingPage
      ? "pt-2 md:pt-4"
      : "pt-6 md:pt-8";

  return (
    <>
      {!isAuthPage && !isNotFoundPage && <Header />}
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1 min-h-0">
          {shouldShowSidebar && <SideBar />}
          <main className={`flex-1 bg-white min-w-0 ${mainPaddingClass}`}>
            {children}
          </main>
        </div>
        {!isAuthPage && !isNotFoundPage && <Footer />}
      </div>
    </>
  );
}
