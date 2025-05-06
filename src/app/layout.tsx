"use client";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ReduxProvider } from "@/redux/provider";
import { SessionProvider } from "next-auth/react";

import { ToastContainer } from "react-toastify";

import { getFeedbacks, getPosts, getProducts } from "@/actions/fetch.actions";
import { getLoras } from "@/actions/lora.action"; // Assuming correct path
import { setProducts } from "@/redux/slices/product"; // Assuming correct path
import { setloras } from "@/redux/slices/lora"; // Assuming correct path
import { getGenerations } from "@/actions/generate.actions";
import { setgenerations } from "@/redux/slices/generate";
import { setfeedbacks } from "@/redux/slices/feeback";
import { setposts } from "@/redux/slices/post";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});
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
              {/* {children} */}
              <FetchInitialData>{children}</FetchInitialData>
              <ToastContainer />
            </ThemeProvider>
          </ReduxProvider>
        </SessionProvider>
        {/* </SidebarProvider> */}
      </body>
    </html>
  );
}

const Spinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%", // Takes full height of its container
      width: "100%", // Takes full width of its container
    }}
  >
    {/* You can use an SVG, CSS spinner, or a component library spinner */}
    <svg
      className="animate-spin h-8 w-8 text-blue-500" // Example styling
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

function FetchInitialData({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchInitialData = async () => {
      try {
        const [prd, lora, gen, fb, pst] = await Promise.all([
          getProducts(),
          getLoras(),
          getGenerations(),
          getFeedbacks(),
          getPosts(),
        ]);
        if (isMounted) {
          dispatch(setProducts(prd));
          dispatch(setloras(lora));
          dispatch(setgenerations(gen));
          dispatch(setfeedbacks(fb));
          dispatch(setposts(pst));
        }
      } catch (err) {
        console.error(err);
        if (isMounted)
          setError("Failed to load essential data. Please try refreshing.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <div>
      {children}
      <main className="flex-1 relative p-4 md:p-6">
        {" "}
        {/* Adjust padding as needed */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            {/* Use absolute positioning to overlay */}
            <Spinner />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-600 bg-background/50 backdrop-blur-sm z-10">
            <p>{error}</p> {/* Display error message */}
          </div>
        )}
      </main>
    </div>
  );
}
