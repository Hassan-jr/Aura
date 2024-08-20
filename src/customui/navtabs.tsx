"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";

const pages = [
  {
    path: "/shots",
    name: "Shots",
  },
  {
    path: "/text2img",
    name: "Gen",
  },
  {
    path: "/img2img",
    name: "Img2Img",
  },
  {
    path: "/train",
    name: "Train",
  },
  {
    path: "/profile",
    name: "Profile",
  },
];

export function Navtabs() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // prefetch routes
  useEffect(() => {
    router.prefetch("/shots");
    router.prefetch("/text2img");
    router.prefetch("/img2img");
    router.prefetch("/train");
    router.prefetch("/profile");
  }, [router]);

  // navigate on swipte
  useEffect(() => {
    if (pages[currentPage]?.path) {
      router.push(pages[currentPage]?.path);
    }
  }, [currentPage, router]);

  // remain in the same url when refreshed
  useEffect(() => {
    const index = pages.findIndex((page) => page.path === pathname);
    if (index) {
      setCurrentPage(index);
    }
  }, [pathname]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (currentPage === 0 && newDirection === -1) {
      setCurrentPage(0);
      return;
    }
    setCurrentPage((prevPage) => {
      let nextPage = prevPage + newDirection;
      if (nextPage < 0) nextPage = 1;
      if (nextPage >= pages.length) nextPage = pages.length - 1;
      return nextPage;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  return (
    <div>
      <Tabs
        value={pages[currentPage]?.name}
        className="w-full md:w-[400px]  my-1 mx-auto"
      >
        <TabsList className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
          {pages.map((page, i) => (
            <Link href={page?.path} key={i} legacyBehavior passHref>
              <TabsTrigger
                value={page?.name}
                onClick={() => {
                  setDirection(i > currentPage ? 1 : -1);
                  setCurrentPage(i);
                }}
                className={
                  currentPage === i
                    ? "bg-primary text-primary-foreground font-bold"
                    : "font-bold text-white m-0"
                }
              >
                {page?.name}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
      {/* </Card> */}

      <div className="flex-grow overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(
              event: MouseEvent | TouchEvent | PointerEvent,
              { offset, velocity }: PanInfo
            ) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="w-full h-full"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
