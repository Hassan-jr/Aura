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
import {
  getDiscounts,
  getInvoices,
  getMeetings,
} from "@/actions/fetch.actions";
import { setdiscounts } from "@/redux/slices/discount";
import { useDispatch } from "react-redux";
import { selectchats } from "@/redux/slices/chat";
import { selectusers } from "@/redux/slices/user";
import { selectProducts } from "@/redux/slices/product";
import { setinvoices } from "@/redux/slices/invoice";
import { getGenerations } from "@/actions/generate.actions";
import { setgenerations } from "@/redux/slices/generate";
import { setmeetings } from "@/redux/slices/meeting";
import { MessageImageBubble } from "./image-chat";

interface UserDetails {
  id: string;
  name: string;
  email: string;
}

export function AIChat() {
  const { data: session } = useSession();
  // select data
  const prevmessages = useAppSelector(selectchats);
  const users = useAppSelector(selectusers);
  const products = useAppSelector(selectProducts);
  const bid = session?.user?.id;

  const [messages, setMessages] = useState<any>(prevmessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setselectedUserId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

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

  const selectedProductId = useAppSelector(selectProductId);
  

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

  // -------------------- Update Discount State ----------------------------
  const updateDiscount = async () => {
    try {
      const discounts = await getDiscounts();
      dispatch(setdiscounts(discounts));
    } catch (error) {
      console.log("An Error Occured");
    }
  };

  // -------------------- Update Invoice State ----------------------------
  const updateInvoice = async (id) => {
    try {
      const invoices = await getInvoices(id);
      dispatch(setinvoices(invoices));
    } catch (error) {
      console.log("An Error Occured");
    }
  };

  // -------------------- Update Meetings State ----------------------------
  const updateMeeting = async (id) => {
    try {
      const meetings = await getMeetings(id);
      dispatch(setmeetings(meetings));
    } catch (error) {
      console.log("An Error Occured");
    }
  };

  // -------------------- Update Generation State ----------------------------
  const updateGenerations = async () => {
    try {
      const generations = await getGenerations();
      dispatch(setgenerations(generations));
    } catch (error) {
      console.log("An Error Occured");
    }
  };

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

      // check reloading:
      // discountFunc: true, invoiceFunc: false, meetingFunc: false, imageFunc:false
      if (data.hasOwnProperty("discountFunc") && data.discountFunc === true) {
        await updateDiscount();
      }
      if (data.hasOwnProperty("invoiceFunc") && data.invoiceFunc === true) {
        await updateInvoice(bid);
      }
      if (data.hasOwnProperty("meetingFunc") && data.meetingFunc === true) {
        await updateMeeting(bid);
      }
      if (data.hasOwnProperty("imageFunc") && data.imageFunc === true) {
        await updateGenerations();
      }
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
                  {filteredMessages?.map((message, idx) =>
                    message?.isImage == true ? (
                      <MessageImageBubble key={idx} message={message} />
                    ) : (
                      <MessageBubble key={idx} message={message} />
                    )
                  )}
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
                    className="bg-black hover:bg-slate-700 text-white"
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
