import { useState } from "react";
import { Product } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Usersidebar({
  users,
  selectedUserId,
  onSelectUser,
  isUserSide = false,
  messages,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredusers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) && messages.some(message => message.userId === user._id)
  );

  return (
    <Sidebar
      className={` ${
        isUserSide ? "absolute top-40 ml-[360px]" : "absolute top-28 ml-[35px]"
      } rounded-lg mt-[0px] h-[65%]`}
    >
      <SidebarHeader className="border-b px-4 py-2">
        <Input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="space-y-2 p-2">
            {filteredusers.map((user) => (
              <Button
                key={user._id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  selectedUserId === user._id && "bg-blue-600 text-white"
                )}
                onClick={() => onSelectUser(user._id)}
              >
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarImage src={user.profileUrl} alt={user.name} />
                  <AvatarFallback
                    className={cn(
                      "",
                      selectedUserId === user._id && "bg-white text-blue-600"
                    )}
                  >
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs truncate w-40">{user.email}...</div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
