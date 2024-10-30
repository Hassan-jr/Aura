import ProfileCard from "./profileCard";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlurFadeDemo from "../home/images";
import TopStories from "../home/stories";
import Navheader from "@/customui/navheader";

export default function Home() {
  return (
    <main>
      <Navheader>
        <Card className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto ">
          {/* Profile */}
          <ProfileCard />
          {/* tabls */}
          <div className="mx-auto">
            <Tabs
              defaultValue="shots"
              className="w-full md:w-1/2  my-1 mx-auto z-20"
            >
              <TabsList className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold">
                <TabsTrigger value="shots">Shots</TabsTrigger>
                <TabsTrigger value="characters">Ai Characters</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              <TabsContent value="shots">
                <BlurFadeDemo />
              </TabsContent>
              <TabsContent value="characters">
                <TopStories />
              </TabsContent>
              <TabsContent value="billing">
                <BlurFadeDemo />
              </TabsContent>
              <TabsContent value="account">
                <TopStories />
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </Navheader>
    </main>
  );
}
