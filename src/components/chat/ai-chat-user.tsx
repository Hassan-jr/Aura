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
import { toast } from "../ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export function AIChat({ prevmessages, users, products }) {
  const [messages, setMessages] = useState(prevmessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setselectedUserId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const [bid, setBid] = useState("");

  const [selectedProductId, setselectedProductId] = useState<string | null>(
    null
  );

  const handleProductSelect = (productId: string) => {
    setselectedProductId(productId);
    const productDetails = products.find(
      (product) => product._id === productId
    );
    setBid(productDetails?.userId);
  };

  // update the bid
  useEffect(() => {
    if (selectedProductId) {
      const productDetails = products.find(
        (product) => product._id === selectedProductId
      );

      setBid(productDetails?.userId);
    }
  }, [selectedProductId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast({
        variant: "destructive",
        title: "You need to select store user",
        description: "",
      });

      return;
    }

    if (!input.trim() || !selectedUserId) return;

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

    console.log("Sent Product is :", productDetails);

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
          message.bId === selectedUserId &&
          message.productId === selectedProductId
      )
    );
  }, [messages, selectedUserId, selectedProductId]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (selectedUserId) {
      const NewFilteredProducts = products.filter(
        (product) => product.userId === selectedUserId
      );

      setFilteredProducts(NewFilteredProducts);

      setselectedProductId(
        NewFilteredProducts.length > 0 ? NewFilteredProducts[0]?._id : null
      );
    }
  }, [selectedUserId, products]);

  return (
    <div className="flex h-[80%] mt-[-50px]">
      <Usersidebar
        users={users}
        selectedUserId={selectedUserId}
        onSelectUser={setselectedUserId}
        isUserSide={true}
        messages={messages} // added this
      />
      <div className="flex-1 flex flex-col mt-0">
        <Card className="flex-1 m-4 bg-background/60 backdrop-blur-sm shadow-xl border-t border-l border-background/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center z-50">
              <ProductSelect
                products={filteredProducts}
                // onSelect={handleProductSelect}
                // selectedProductDetails={products.find(
                //   (product) => product._id === selectedProductId
                // )}
              />
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden">
            <h1>User id: {selectedUserId}</h1>
            <h1>Product id: {selectedProductId}</h1>
            <ScrollArea className="h-[350px] pr-4" ref={scrollAreaRef}>
              {filteredMessages?.map((message) => (
                <MessageBubble key={message?.userId} message={message} />
              ))}
              {filteredMessages.length === 0 && (
                <div className="w-full py-0 bg-red-500">
                  <p className="mx-auto">No Messages</p>
                </div>
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
  );
}
