import React from "react";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card } from "@/components/ui/card";

export function LandingNav() {
  return (
    <div className="flex flex-col w-full m-2">
      <Card className="sticky top-0 z-50">
        <Tabs
          value=""
          className="w-full my-1 flex justify-center flex-nowrap rounded-full relative"
        >
          <TabsList className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-1 h-auto rounded-sm bg-transparent gap-1">
            {/* Features */}
            <Link href="#" prefetch={false}>
              <TabsTrigger
                value="feaatures"
                className="flex flex-col flex-nowrap justify-center align-middle bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white py-1"
              >
                Features
              </TabsTrigger>
            </Link>
            {/* Pricing */}
            <Link href="#" prefetch={false}>
              <TabsTrigger
                value="feaatures"
                className="flex flex-col flex-nowrap justify-center align-middle bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white py-1"
              >
                Pricing
              </TabsTrigger>
            </Link>
            {/* Testmonials */}
            <Link href="#" prefetch={false}>
              <TabsTrigger
                value="feaatures"
                className="flex flex-col flex-nowrap justify-center align-middle bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white py-1"
              >
                Testmoials
              </TabsTrigger>
            </Link>
            {/* App */}
            <Link href="/products" prefetch={false}>
              <TabsTrigger
                value="feaatures"
                className="flex flex-col flex-nowrap justify-center align-middle bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white py-1"
              >
                App
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </Card>
    </div>
  );
}
