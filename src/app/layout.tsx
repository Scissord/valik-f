import type { Metadata } from "next";
import { geistMono, geistSans } from "../config/fonts";
import "./globals.css";
import { Provider } from "@/components";

export const metadata: Metadata = {
  title: {
    template: "%s | Valik.kz",
    default: "Valik.kz | Интернет-магазин строительных материалов",
  },
  description: "Valik.kz — ваш надежный поставщик строительных материалов. Широкий ассортимент товаров для ремонта и строительства, от фундамента до отделки. Гарантия качества и быстрая доставка.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
