// import type { Metadata } from "next";
// import { Roboto } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "@/components/ui/toaster";
// import { ThemeProvider } from "@/components/theme-provider";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ReduxProvider } from "@/redux/provider";

// const roboto = Roboto({
//   weight: ["100", "300", "400", "500", "700", "900"],
//   style: ["normal", "italic"],
//   subsets: ["latin"],
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Inprime AI",
//   description:
//     "Train an AI Character of yourself and Generate Full body shots, Half body shots and Close-up (headshot) Photos of yourself",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={roboto.className}>
//         <ClerkProvider>
//           <ReduxProvider>
//             <ThemeProvider>
//               <Toaster />
//               {children}
//             </ThemeProvider>
//           </ReduxProvider>
//         </ClerkProvider>
//       </body>
//     </html>
//   );
// }

// // <ReduxProvider>
// {
//   /* <ClerkProvider> */
// }

import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
// import { ClerkProvider } from "@clerk/nextjs";
import { ReduxProvider } from "@/redux/provider";

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
        {/* <ClerkProvider> */}
          <ReduxProvider>
            <ThemeProvider>
              <Toaster />
              {children}
            </ThemeProvider>
          </ReduxProvider>
        {/* </ClerkProvider> */}
      </body>
    </html>
  );
}
