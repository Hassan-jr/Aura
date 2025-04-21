"use client"

import * as React from "react"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcher } from "./account-switcher"
import { MailDisplay } from "./mail-display"
import { MailList } from "./mail-list"
import { Nav } from "./nav"
import { type Mail } from "../data"
import { useMail } from "../use-mail"
import { Button } from "@/components/ui/button"
import { findChatsForEmail, getProducts } from "@/actions/fetch.actions";
import { toast } from "@/components/ui/use-toast"

export function Mail({
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  data,
  products,
  bid
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [mail] = useMail()


    const sendMessage = async (
      messages,
      productId,
      userId,
      bId,
      productDetails
    ) => {
      try {
        const url =
        process.env.NODE_ENV == "development"
          ? process.env.NEXTAUTH_URL
          : process.env.NEXT_PUBLIC_APP_URL;

        const response = await fetch(`${url}api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messages,
            productId: productId,
            userId: userId,
            bId: bId,
            productDetails: productDetails,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to get response");
        }
  
        toast({
          variant: "default",
          title: "Email Reply Sent Successfuly",
          description: "",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "An Error Occurred While replying to email",
          description: "",
        });
        console.error("Error:", error);
      }
    };
  
    const refresh = async () => {
      if (data.length > 0) {
        // const bid = session?.user?.id;
        const from = data[0]?.email;
        const to = data[0]?.to;
        const subject = data[0]?.subject;
        const text = data[0]?.text;
  
        const { messages, userId, productId } = await findChatsForEmail(
          from,
          bid
        );
  
        const productDetails = products.find(
          (product) => product._id === productId
        );
  
        const userMessage = {
          userId: userId,
          bId: bid,
          productId: productId,
          role: "user",
          content: text,
        };
  
        const finalMessages = [...messages, userMessage];
  
        await sendMessage(finalMessages, productId, userId, bid, productDetails);
      }
    };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full max-h-[800px] items-stretch"
      >
       
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <Button className="bg-black text-white hover:bg-slate-500 mr-4" onClick={refresh}>Refresh</Button>
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Personalized Athletic Sneakers */}
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
