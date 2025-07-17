"use client"
import { AIAssistant } from "../ai-assistant";
import { AIAssistantProvider } from "../ai-assistant/ai-context";
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
  const shouldShowGlobalComponents = !isAuthPage && !isNotFoundPage;
  
  return (
    <AIAssistantProvider>
      {children}
      {shouldShowGlobalComponents && <AIAssistant />}
      {shouldShowGlobalComponents && <MobileNavbar />}
    </AIAssistantProvider>
  );
};
