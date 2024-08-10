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
          <div className="flex flex-col items-center justify-center gap-2 md:gap-3 p-1 md:p-4">
            {/* Stories */}
            <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              <Card className="w-full p-0">
                {/* <CardHeader className="pb-3">
                  <CardTitle>Stories</CardTitle>
                </CardHeader> */}
                <CardContent className="p-1">
                    <TopStories />
                </CardContent>
              </Card>
            </div>

            {/* POSTS */}
            <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
              <Card className="w-full">
                {/* <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="text-lg">
                      Community Shots
                    </CardTitle>
                  </div>
                </CardHeader> */}
                <CardContent className="flex align-top justify-start items-start p-1">
                  <BlurFadeDemo />
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Updated <time dateTime="2023-11-23">November 23, 2023</time>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
