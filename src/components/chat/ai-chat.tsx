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
import { Usersidebar } from "./sidebar";
import { ProductSelect } from "./chat-product-select";
import Image from "next/image";

import { useAppSelector } from "@/redux/hooks";
import { selectProductId } from "@/redux/slices/productId";
import { useSession } from "next-auth/react";
import { selectcalenders } from "@/redux/slices/calender";

interface UserDetails {
  id: string;
  name: string;
  email: string;
}

export function AIChat({ prevmessages, users, products, bid }) {
  const [messages, setMessages] = useState(prevmessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setselectedUserId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  const [selectedUserDetails, setSelectedUserDetails] =
    useState<UserDetails | null>(null);
  useEffect(() => {
    if (selectedUserId) {
      const user = users.find((user) => user._id == selectedUserId);
      setSelectedUserDetails({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    }
  }, [selectedUserId]);

  const count = useAppSelector(selectProductId);

  const productId = useAppSelector(selectProductId);
  useEffect(() => {
    const filteredPosts = prevmessages?.filter(
      (mss) => mss.productId == productId
    );
    setMessages(filteredPosts);
  }, [productId]);

  const [selectedProductId, setselectedProductId] = useState(count);
  useEffect(() => {
    setselectedProductId(count);
  }, [count]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // get credentials
  const calenders = useAppSelector(selectcalenders);

  const [credentials, setCredentials] = useState({
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    GOOGLE_REFRESH_TOKEN: "",
  });

  useEffect(() => {
    if (calenders.length > 0) {
      setCredentials({
        GOOGLE_CLIENT_ID: calenders[0].GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: calenders[0].GOOGLE_CLIENT_SECRET,
        GOOGLE_REFRESH_TOKEN: calenders[0].GOOGLE_REFRESH_TOKEN,
      });
    }
  }, [calenders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUserId) return;

    const userMessage: Message = {
      userId: selectedUserId,
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
          userId: selectedUserId,
          bId: bid,
          productDetails: productDetails,
          // other
          customerName: selectedUserDetails?.name,
          userEmail: selectedUserDetails?.email,
          myEmail: session?.user?.email,
          // secrets
          clientId: credentials.GOOGLE_CLIENT_ID,
          clientSecret: credentials.GOOGLE_CLIENT_SECRET,
          refreshToken: credentials.GOOGLE_REFRESH_TOKEN,
          customerDetails: selectedUserDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const aiMessage: Message = {
        userId: selectedUserId,
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

  const [filteredMessages, setfilteredMessages] = useState(
    messages?.filter(
      (message) =>
        message.userId === selectedUserId &&
        message.productId === selectedProductId
    )
  );
  useEffect(() => {
    setfilteredMessages(
      messages?.filter(
        (message) =>
          message.userId === selectedUserId &&
          message.productId === selectedProductId
      )
    );
  }, [messages, selectedUserId, selectedProductId]);

  // auto select product for the first time
  useEffect(() => {
    if (selectedUserId && products.length > 0 && selectedProductId === null) {
      setselectedProductId(products[0]._id);
    }
  }, [selectedUserId, products]);

  return (
    <div>
      {messages?.length > 0 ? (
        <div className="flex mt-0 m-0">
          <Usersidebar
            users={users}
            selectedUserId={selectedUserId}
            onSelectUser={setselectedUserId}
            messages={messages}
          />
          <div className="flex-1 flex flex-col h-[500px]">
            <Card className="flex-1 m-0 bg-background/60 backdrop-blur-sm shadow-xl border-t border-l border-background/20">
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className=" h-[500px] mt-0 " ref={scrollAreaRef}>
                  {filteredMessages?.map((message, idx) => (
                    <MessageBubble key={idx} message={message} />
                  ))}
                  {filteredMessages.length === 0 && (
                    <div className="w-full py-10">
                      <p className="mx-auto text-center italic">
                        Select A Customer
                      </p>
                    </div>
                  )}
                  {isLoading && <LoadingBubble />}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form
                  onSubmit={handleSubmit}
                  className="flex gap-2 w-11/12 fixed bottom-1"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      selectedUserId
                        ? "Type your message..."
                        : "Select a product to start chatting"
                    }
                    disabled={isLoading || !selectedUserId}
                    className="flex-grow"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !selectedUserId}
                    size="icon"
                    className="bg-black text-white"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-5 w-64 mx-auto">
          No customer engagement available for this product
        </Card>
      )}
    </div>
  );
}
