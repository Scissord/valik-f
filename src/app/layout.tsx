import type { Metadata } from "next";
import { geistMono, geistSans } from "../config/fonts";
import "./globals.css";
import { Provider } from "@/components";

export const metadata: Metadata = {
  title: {
    template: "%s | Valik.kz",
    default: "Valik.kz | Сервис по поиску и закупу строительных материалов и услуг",
  },
  description: "Valik.kz — сервис по поиску и закупу строительных материалов и услуг. Широкий ассортимент товаров для ремонта и строительства, от фундамента до отделки. Гарантия качества и быстрая доставка.",
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
