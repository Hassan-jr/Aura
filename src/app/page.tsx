"use client";
import { LandingHeader } from "@/components/landing/header";
import { ImageTree } from "@/components/landing/imgtree";
import { ModeToggle } from "@/customui/themebtn";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const lightTheme =
    "absolute top-0 -z-10 h-auto w-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]";
  const darkTheme =
    "absolute top-0 z-[-2] h-auto w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]";
  const { theme } = useTheme();
  console.log("Theme, ", theme);

  const [bgtheme, setbgtheme] = useState(
    theme === "dark" ? darkTheme : lightTheme
  );

  useEffect(() => {
    setbgtheme(theme === "dark" ? darkTheme : lightTheme);
  }, [theme]);

  return (
    <main className={bgtheme}>
      <ModeToggle />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <LandingHeader />
        <ImageTree />
      </div>
    </main>
  );
}
