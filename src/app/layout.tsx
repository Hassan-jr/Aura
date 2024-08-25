import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { NavigationMenu } from "@/customui/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ReduxProvider } from '@/redux/provider';


const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "My Ai Shots",
  description:
    "Train an AI Character of yourself and Generate Full body shots, Half body shots and Close-up (headshot) Photos of yourself",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={roboto.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {/* <NavigationMenu/> */}
              {children}
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </ReduxProvider>
  );
}
