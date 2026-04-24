import type { Metadata } from "next";
import { geistMono, geistSans, titleFont } from "../config/fonts";
import "./globals.css";
import { Provider } from "@/components";

export const metadata: Metadata = {
  metadataBase: new URL("https://valik.kz"),
  title: {
    template: "%s | Valik.kz",
    default: "Valik.kz — стройматериалы и услуги в Казахстане",
  },
  description: "Valik.kz — маркетплейс строительных материалов и услуг в Казахстане. Широкий ассортимент для ремонта и строительства. Быстрая доставка по всей стране.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${titleFont.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
