import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { TelegramProvider } from "@/components/telegram/TelegramProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Evil Claude — Reasoning Studio",
  description: "Ask anything. Deep reasoning, artifacts, and web-grounded answers.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b0c10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh bg-coal-950 font-sans text-zinc-200 antialiased">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}
