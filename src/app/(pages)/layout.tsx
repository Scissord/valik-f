"use client";

import { Footer, SideBar, Header } from "@/components";
import { usePathname } from "next/navigation";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/registration";
  const isLandingPage = pathname === "/";

  // Показываем сайдбар и добавляем отступ только на странице списка товаров
  const shouldShowSidebar = pathname === '/products';
  
  const mainPaddingClass = isAuthPage
    ? ""
    : isLandingPage
      ? "pt-2 md:pt-4"
      : "pt-6 md:pt-8";

  return (
    <>
      {!isAuthPage && <Header />}
      <SideBar />
      <div className={shouldShowSidebar ? "md:pl-60" : ""}>
        <main
          className={`min-h-screen ${mainPaddingClass}`}
        >
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </>
  );
}
