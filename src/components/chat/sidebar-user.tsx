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
  selectedProductId,
  onSelectProduct,
  products,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Sidebar className=" absolute top-40 ml-[360px] rounded-lg mt-[0px] h-[65%]">
      <SidebarHeader className="border-b px-4 py-2">
        <Input
          type="search"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="space-y-2 p-2">
            {products.map((product) => (
              <Button
                key={product._id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  selectedProductId === product._id && "bg-blue-600 hover:bg-blue-500 text-white"
                )}
                onClick={() => onSelectProduct(product._id)}
              >
                <div className="text-left">
                  <div className="font-semibold">{product.title}</div>
                  <div className="text-xs truncate w-40">
                    {product.description.slice(0, 10)}...
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
