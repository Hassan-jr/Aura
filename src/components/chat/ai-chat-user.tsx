"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble, LoadingBubble } from "./message-bubble";
import { Message } from "./types";
import { Check, SendHorizontal } from "lucide-react";
import { Usersidebar } from "./sidebar-user";
import Image from "next/image";
import { toast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
import { getSingleUsers } from "@/actions/fetch.actions";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllCalenders } from "@/actions/calender.action";

export function AIChat({ prevmessages, users, products }) {
  const [messages, setMessages] = useState(prevmessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const [bid, setBid] = useState("");
  const [bidDetails, setBidDetails] = useState(null);

  const [selectedProductId, setselectedProductId] = useState<string | null>(
    null
  );

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // update the bid
  useEffect(() => {
    if (selectedProductId) {
      const productDetails = products.find(
        (product) => product._id === selectedProductId
      );

      setBid(productDetails?.userId);
    }
  }, [selectedProductId]);
  // fetch bid details
  useEffect(() => {
    const fetchbidDetails = async (id) => {
      try {
        const bidDetails = await getSingleUsers(id);
        console.log("bidDetails:", bidDetails);

        setBidDetails(bidDetails);
      } catch (error) {
        console.log("An Error Occured fetching SME details");
      }
    };

    if (bid) {
      fetchbidDetails(bid);
    }
  }, [bid]);

  // scroll
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const [credentials, setCredentials] = useState({
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    GOOGLE_REFRESH_TOKEN: "",
  });

  console.log("credentials:", credentials);
  useEffect(() => {
    if (!bid) return;

    const fetchAndSet = async () => {
      setIsLoading(true);
      try {
        const calenders = await getAllCalenders(bid);

        if (calenders && calenders.length > 0) {
          setCredentials({
            GOOGLE_CLIENT_ID: calenders[0].GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: calenders[0].GOOGLE_CLIENT_SECRET,
            GOOGLE_REFRESH_TOKEN: calenders[0].GOOGLE_REFRESH_TOKEN,
          });
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch calendars:", err);
        setIsLoading(false);
      }
    };

    fetchAndSet();
  }, [bid, getAllCalenders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId) {
      toast({
        variant: "destructive",
        title: "You need to select product id",
        description: "",
      });

      return;
    }

    if (!input.trim()) return;

    if (!selectedProductId) {
      toast({
        variant: "destructive",
        title: "You need to select Product",
        description: "",
      });

      return;
    }

    const userMessage: Message = {
      userId: session.user.id,
      bId: bid,
      productId: selectedProductId,
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const productDetails = products.find(
      (product) => product._id === selectedProductId
    );

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          productId: selectedProductId,
          userId: session.user.id,
          bId: bid,
          productDetails: productDetails,
          // others
          customerName: session?.user?.name,
          userEmail: session?.user?.email,
          myEmail: bidDetails?.email,
          // secrets
          clientId: credentials.GOOGLE_CLIENT_ID,
          clientSecret: credentials.GOOGLE_CLIENT_SECRET,
          refreshToken: credentials.GOOGLE_REFRESH_TOKEN,
          customerDetails: session.user,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const aiMessage: Message = {
        userId: session.user.id,
        productId: selectedProductId,
        role: "assistant",
        content: data.result,
        bId: bid,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  // filter messages
  const [filteredMessages, setfilteredMessages] = useState(
    messages?.filter(
      (message) =>
        message.bId === bid && message.productId === selectedProductId
    )
  );

  useEffect(() => {
    setfilteredMessages(
      messages?.filter(
        (message) =>
          message.bId === bid && message.productId === selectedProductId
      )
    );
  }, [messages, bid, selectedProductId]);

  // filter products
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      const NewFilteredProducts = products.filter((product) =>
        messages.some((message) => message.productId === product._id)
      );

      setFilteredProducts(NewFilteredProducts);

      setselectedProductId(
        NewFilteredProducts.length > 0 ? NewFilteredProducts[0]?._id : null
      );
    }
  }, [messages, products]);

  return (
    <div className="flex h-[80%] mt-[-50px]">
      <Usersidebar
        selectedProductId={selectedProductId}
        onSelectProduct={setselectedProductId}
        products={filteredProducts}
      />
      <div className="flex-1 flex flex-col mt-0">
        <Card className="flex-1 m-4 bg-background/60 backdrop-blur-sm shadow-xl border-t border-l border-background/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center z-50">
              {/* <ProductSelect products={filteredProducts} /> */}
              <Button
                key={bidDetails?._id}
                variant="ghost"
                className={cn(
                  "w-full justify-start bg-blue-600 text-white py-1"
                )}
              >
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarImage
                    src={bidDetails?.profileUrl}
                    alt={bidDetails?.name}
                  />
                  <AvatarFallback>
                    {bidDetails?.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-semibold">{bidDetails?.name}</div>
                  <div className="text-xs truncate w-40">
                    {bidDetails?.email}
                  </div>
                </div>
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-[350px] pr-4" ref={scrollAreaRef}>
              {filteredMessages?.map((message, idx) => (
                <MessageBubble key={idx} message={message} />
              ))}
              {filteredMessages.length === 0 && (
                <Card className="w-full py-10 text-center bg-blue-50 mt-auto">
                  <p className="mx-auto">No Messages</p>
                </Card>
              )}
              {isLoading && <LoadingBubble />}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedProductId
                    ? "Type your message..."
                    : "Select a product to start chatting"
                }
                disabled={isLoading || !selectedProductId}
                className="flex-grow"
              />
              <Button
                type="submit"
                disabled={isLoading || !selectedProductId}
                size="icon"
                className="bg-black hover:bg-slate-900 text-white"
              >
                <SendHorizontal className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
