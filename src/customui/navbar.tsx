"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/customui/themebtn";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";

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
    path: "/train",
    name: "Train",
  },
];

export function NavigationMenuDemo() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  console.log("Path Name:", pathname);

  useEffect(() => {
    if (pages[currentPage]?.path) {
      router.push(pages[currentPage]?.path);
    }
  }, [currentPage, router]);

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
    <Card className=" w-full m-0 px-1">
      <div>
        {/* NAV BAR */}
        {/* <Card className="p-0"> */}

        {/* {pathname === "/shots" ? ( */}
        <header className="sticky flex h-14 items-center gap-1 md:gap-4 sm:static sm:h-auto">
          {/* logo */}
          <div>
            <p className="text-xl">My Ai Shots</p>
          </div>
          <div className="relative ml-auto flex-1 md:grow-0 md:mt-2">
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="https://nomapos.com/model/hassanjr001%20(5).jpg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GearIcon</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
        </header>
        {/* ) : ( */}
        {/* "" */}
        {/* )} */}

        <Tabs
          value={pages[currentPage]?.name}
          className="w-full md:w-[400px]  my-1 mx-auto"
        >
          <TabsList className="bg-slate-300 dark:bg-slate-600 rounded-lg">
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
                      : "font-bold text-black dark:text-primary"
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
              className="absolute w-full h-full"
            />
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
