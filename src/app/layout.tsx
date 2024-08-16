import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import { ThemeProvider } from "@/components/theme-provider";

import { NavigationMenuDemo } from "@/customui/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Ai Shots",
  description: "Train an AI Character of yourself and Generate Full body shots, Half body shots and Close-up (headshot) Photos of yourself",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <NavigationMenuDemo />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
