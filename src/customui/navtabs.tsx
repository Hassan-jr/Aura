"use client";

import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HomeIcon,
  BoxModelIcon,
  PlusCircledIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";

const pages = [
  {
    path: "/posts",
    name: "Home",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    path: "/models",
    name: "Models",
    icon: <BoxModelIcon className="h-5 w-5" />,
  },
  {
    path: "/create",
    name: "Create",
    icon: <PlusCircledIcon className="h-7 w-7" />,
  },
  // {
  //   path: "/train",
  //   name: "Train",
  //   icon: <PlusCircledIcon className="h-5 w-5" />,
  // },
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

  const [dragDirection, setDragDirection] = useState<number>(0);

  useEffect(() => {
    pages.forEach(page => router.prefetch(page.path))
  }, [router])

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

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const swipeThreshold = 50;
      if (Math.abs(info.offset.x) > swipeThreshold) {
        if (info.offset.x > 0 && currentPageIndex > 0) {
          navigateToPage(currentPageIndex - 1);
        } else if (info.offset.x < 0 && currentPageIndex < pages.length - 1) {
          navigateToPage(currentPageIndex + 1);
        }
      }
      setDragDirection(0);
    },
    [currentPageIndex, navigateToPage]
  );

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setDragDirection(info.offset.x < 0 ? 1 : -1);
    },
    []
  );

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

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
      <motion.div
        // className="flex-grow overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
      >
        <AnimatePresence initial={false} mode="wait" custom={dragDirection}>
          <motion.div
            key={pathname}
            custom={dragDirection}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            // className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
