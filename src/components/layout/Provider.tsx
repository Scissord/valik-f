"use client";
import { AIAssistantProvider } from "../features/ai-assistant";
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

    observer.observe(document.body, { childList: true, subtree: true });
    const notFoundElement = document.getElementById('page-not-found');
    setIsNotFoundPage(!!notFoundElement);

    return () => observer.disconnect();
  }, [pathname]);

  // Скрываем мобильный навбар на главной (чат-бот занимает весь экран)
  const shouldShowMobileNavbar = !isNotFoundPage && pathname !== '/';

  return (
    <AIAssistantProvider>
      {children}
      {shouldShowMobileNavbar && <MobileNavbar />}
    </AIAssistantProvider>
  );
};
