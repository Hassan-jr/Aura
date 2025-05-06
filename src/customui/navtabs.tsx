"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HomeIcon,
  BoxModelIcon,
  PlusCircledIcon,
  PersonIcon,
  ImageIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";

const pages = [
  {
    path: "/products",
    name: "Products",
    icon: <HomeIcon className="h-5 w-5" />,
  },

  {
    path: "/posts",
    name: "Posts",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    path: "/create",
    name: "Create",
    icon: <PlusCircledIcon className="h-7 w-7" />,
  },
  {
    path: "/models",
    name: "Models",
    icon: <BoxModelIcon className="h-5 w-5" />,
  },
  {
    path: "/chat",
    name: "Chats",
    icon: <ChatBubbleIcon className="h-5 w-5" />,
  },
  {
    path: "/profile",
    name: "Profile",
    icon: <PersonIcon className="h-5 w-5" />,
  },
];

export function OptimizedTabBar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentPageIndex = useMemo(() => {
    return pages.findIndex((page) => page.path === pathname);
  }, [pathname]);


  useEffect(() => {
    pages.forEach((page) => router.prefetch(page.path));
  }, [router]);

  const navigateToPage = useCallback(
    (index: number) => {
      const page = pages[index];
      if (page) {
        startTransition(() => {
          router.push(page.path);
        });
      }
    },
    [router]
  );

  return (
    <div className="flex flex-col w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto py-2 px-1">
      <Card className="fixed bottom-0 md:sticky md:top-0 z-50 w-full">
        <Tabs
          value={pages[currentPageIndex]?.name}
          className="w-full my-1 flex justify-center flex-nowrap rounded-full relative"
        >
          <TabsList className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-1 h-auto rounded-sm bg-transparent">
            {pages.map((page, i) => (
              <Link href={page.path} key={i}>
                <TabsTrigger
                  value={page.name}
                  onClick={() => navigateToPage(i)}
                  onMouseEnter={() => router.prefetch(page.path)}
                  className={
                    currentPageIndex === i
                      ? "flex flex-col flex-nowrap justify-center align-middle bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white py-1 mx-1"
                      : "flex flex-col flex-nowrap justify-center align-middle text-black dark:text-white m-0 py-1 hover:bg-blue-300 transition-colors mx-1"
                  }
                >
                  <p className={currentPageIndex === i ? "text-white" : ""}>
                    {page.icon}
                  </p>
                  <p
                    className={
                      currentPageIndex === i
                        ? "text-xs font-semibold text-white"
                        : "text-xs font-semibold"
                    }
                  >
                    {page.name}
                  </p>
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
      </Card>
      <div>{children}</div>
    </div>
  );
}
