"use client";

import { Footer, SideBar, Header } from "@/components";
import { usePathname } from "next/navigation";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Показываем сайдбар и добавляем отступ только на странице списка товаров
  const shouldShowSidebar = pathname === '/products';
  
  return (
    <>
      <Header />
      <SideBar />
      <div className={shouldShowSidebar ? "md:pl-60" : ""}>
        <main className="min-h-screen pt-6 md:pt-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
