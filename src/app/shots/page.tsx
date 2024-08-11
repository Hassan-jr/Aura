import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import BlurFadeDemo from "./images";
import TopStories from "./stories";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="">
        <main className="">
          {/* Stories and Posts */}
          <div className="flex flex-col items-center justify-center gap-1 w-full md:gap-3">
            {/* Stories */}
            <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              <TopStories />
            </div>

            {/* POSTS */}
            <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              <BlurFadeDemo />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
