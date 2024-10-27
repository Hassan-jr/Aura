import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { ModeToggle } from "@/customui/themebtn";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { OptimizedTabBar } from "./navtabs";
import { TextureButton } from "@/components/ui/texture-button";

const Navheader = ({ children }: { children: React.ReactNode }) => {
  // const { userId } = auth();
  // console.log("UserId: ", userId);

  return (
    <>
      <Card className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto py-2 px-1 rounded-sm mt-1">
        <header className="sticky flex flex-row items-center justify-between gap-1 md:gap-4 sm:static sm:h-auto p-0.5 pb-0">
          {/* logo */}

          <Link
            href="/"
            className="flex flex-row gap-1 justify-center align-middle"
          >
            <p className="text-xl font-bold">Inprime</p>
            <p className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              AI
            </p>
          </Link>

          {/* search and credits */}
          <div className="flex flex-row gap-1 justify-center align-middle">
            {/* search */}

            <MagnifyingGlassIcon className="h-9 w-9 text-white   bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-0.5" />


            {/* Singin and Sign UP */}
            <Link href="sign-up">
              <TextureButton variant="accent" size="sm">
                Sing Up
              </TextureButton>
            </Link>

            <Link href="/sign-in">
              <TextureButton variant="accent" size="sm">
                Sing In
              </TextureButton>
            </Link>

            <ModeToggle />
          </div>
        </header>
      </Card>

      <OptimizedTabBar>{children}</OptimizedTabBar>
    </>
  );
};

export default Navheader;
