"use client";
import { AIAssistant, AIAssistantProvider } from "../features/ai-assistant";
import MobileNavbar from "../mobile/navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const Provider = ({ children }: Props) => {
  const pathname = usePathname();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const notFoundElement = document.getElementById('page-not-found');
      setIsNotFoundPage(!!notFoundElement);
    });

    // Начинаем наблюдение за изменениями в body
    observer.observe(document.body, { childList: true, subtree: true });

    // Проверяем наличие элемента сразу после монтирования
    const notFoundElement = document.getElementById('page-not-found');
    setIsNotFoundPage(!!notFoundElement);

    // Очистка при размонтировании
    return () => observer.disconnect();
  }, [pathname]); // Перезапускаем эффект при смене пути

  // Проверяем, находимся ли мы на странице авторизации или регистрации
  const isAuthPage = pathname?.startsWith('/auth');
  // Скрываем виджет ассистента на главной (там полноценный чат), на /v2 и на страницах авторизации
  const shouldShowAIAssistant = !isAuthPage && !isNotFoundPage && pathname !== '/' && pathname !== '/v2';
  const shouldShowMobileNavbar = !isNotFoundPage;

  return (
    <AIAssistantProvider>
      {children}
      {shouldShowAIAssistant && <AIAssistant />}
      {shouldShowMobileNavbar && <MobileNavbar />}
    </AIAssistantProvider>
  );
};
