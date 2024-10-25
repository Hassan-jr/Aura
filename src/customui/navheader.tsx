import Image from "next/image";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/customui/themebtn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// import { UserButton } from "@clerk/nextjs";
// import { auth } from "@clerk/nextjs/server";
// import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Icons } from "@/components/icons";
import { Card } from "@/components/ui/card";
import { OptimizedTabBar } from "./navtabs";


const Navheader = ({ children }: { children: React.ReactNode }) => {
  // const { userId } = auth();
  // console.log("UserId: ", userId);

  return (
    <>
      <Card className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto py-2 px-1 rounded-sm mt-1">
        <header className="sticky flex flex-row items-center justify-between gap-1 md:gap-4 sm:static sm:h-auto p-0.5 pb-0">
          {/* logo */}
          <div className="flex flex-row gap-1 justify-center align-middle">
            <p className="text-xl font-bold">Inprime</p>
            <p className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              AI
            </p>
          </div>

          {/* search and credits */}
          <div className=" flex flex-row gap-1">
            {/* search */}
            <div>
              <MagnifyingGlassIcon className="h-9 w-9 text-white   bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-0.5" />
            </div>

              <ModeToggle />
          </div>
        </header>
      </Card>

      <OptimizedTabBar>{children}</OptimizedTabBar>
    </>
  );
};

export default Navheader;
