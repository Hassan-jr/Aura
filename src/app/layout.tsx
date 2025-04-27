import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/redux/provider";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { ToastContainer } from "react-toastify";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inprime AI",
  description:
    "Train an AI Character of yourself and Generate Full body shots, Half body shots and Close-up (headshot) Photos of yourself",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        {/* <SidebarProvider>
      <AppSidebar /> */}
        <SessionProvider>
          <ReduxProvider>
            <ThemeProvider>
              <Toaster />
              {children}
              <ToastContainer />
            </ThemeProvider>
          </ReduxProvider>
        </SessionProvider>
        {/* </SidebarProvider> */}
      </body>
    </html>
  );
}
