import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const titleFont = Space_Grotesk({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["500", "600", "700"]
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});