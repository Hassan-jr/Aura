"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { LogoutButton } from "./logout";
import Link from "next/link";
import { TextureButton } from "@/components/ui/texture-button";

export function ProfileBadge({ isDashboard = false }) {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user ? (
        isDashboard ? (
          <div>
            <div className="flex flex-row flex-nowrap gap-2">
              <div>
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || ""}
                  />
                  <AvatarFallback>
                    {session.user.name?.[0] || <User />}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || ""}
                  />
                  <AvatarFallback>
                    {session.user.name?.[0] || <User />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-row flex-nowrap gap-2">
                  <div>
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name || ""}
                      />
                      <AvatarFallback>
                        {session.user.name?.[0] || <User />}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      ) : (
        <div className="flex flex-row flex-nowrap gap-1 justify-center align-middle">
          {/* Singin and Sign UP */}
          <Link href="/auth/sign-up">
            <Button variant="outline">Sing Up</Button>
          </Link>

          <Link href="/auth/sign-in">
            <Button variant="outline">Sing In</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
