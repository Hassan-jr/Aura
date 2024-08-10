"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import SparklesText from "@/components/magicui/sparkles-text";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { Card } from "@/components/ui/card";

export function NavigationMenuDemo() {
  return (
    <div className="bg-muted/40">
      {/* NAV BAR */}
      <Card  className="p-3 pb-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <SparklesText text="MyAi Shots" className="text-lg" />
          <div className="relative ml-auto flex-1 md:grow-0">
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="MagnifyingGlassIcon"
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
                  src="/placeholder-user.jpg"
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
        <Tabs defaultValue="shots" className="w-[400px] mt-3 mx-auto">
          <TabsList>
            <Link href="/shots" legacyBehavior passHref>
              <TabsTrigger value="shots">Shots</TabsTrigger>
            </Link>

            <Link href="/train" legacyBehavior passHref>
              <TabsTrigger value="train">Train</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </Card>

      {/* <Card className="p-2 mt-3 w-[400px] align-middle mx-auto">
        <Tabs defaultValue="shots" className="">
          <TabsList>
            <Link href="/shots" legacyBehavior passHref>
              <TabsTrigger value="shots">Shots</TabsTrigger>
            </Link>

            <Link href="/train" legacyBehavior passHref>
              <TabsTrigger value="train">Train</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </Card> */}
    </div>
  );
}
