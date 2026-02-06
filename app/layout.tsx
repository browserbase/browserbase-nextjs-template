/**
 * Root Layout
 *
 * Defines the base HTML structure, fonts, and metadata for the application.
 */

import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ResearchProvider } from "./context/ResearchContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Research Agent - Powered by Browserbase + Next.js",
  description: "Watch AI browse the web and research any topic in real-time. Powered by Browserbase + Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <ResearchProvider>{children}</ResearchProvider>
      </body>
    </html>
  );
}
