// "use client";

// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { MailDisplay } from "./mail-display";
// import { MailList } from "./mail-list";
// import { type Mail } from "../data";
// import { useMail } from "../use-mail";
// import { Button } from "@/components/ui/button";
// import { findChatsForEmail, getSingleUsers } from "@/actions/fetch.actions";
// import { toast } from "@/components/ui/use-toast";
// import { getAllCalenders } from "@/actions/calender.action";
// // import FetchEmails from "@/lib/fetchEmail";
// import { useAppSelector } from "@/redux/hooks";
// import { selectProducts } from "@/redux/slices/product";
// import { useSession } from "next-auth/react";
// import FetchEmails from "@/actions/fetchEmail";

// export function Mail() {
//   const [mails, setMails] = useState<any>([]);
//   const [data, setData] = useState<any>([]);

//   useEffect(() => {
//     const getEmails = async () => {
//       try {
//         const emails = await FetchEmails();
//         setMails(emails);
//         setData(emails);
//       } catch (error) {
//         console.log("An Error Occurred Fetching the Emails:", error);
//       }
//     };

//     getEmails();
//   }, []);

//   const [mail] = useMail();

//   const { data: session } = useSession();
//   const bid = session?.user?.id;
//   const bidEmail = session?.user.email;
//   const defaultLayout = [20, 32, 48];
//   const products = useAppSelector(selectProducts);

//   const sendMessage = async (
//     messages,
//     productId,
//     userId,
//     bId,
//     productDetails,
//     customerDetails,
//     calenders
//   ) => {
//     try {
//       const url =
//         process.env.NODE_ENV == "development"
//           ? process.env.NEXTAUTH_URL
//           : process.env.NEXT_PUBLIC_APP_URL;

//       console.log("Mail calenders:", calenders);

//       const response = await fetch(`/api/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messages: messages,
//           productId: productId,
//           userId: userId,
//           bId: bId,
//           productDetails: productDetails,
//           // other
//           customerName: customerDetails?.name,
//           userEmail: customerDetails?.email,
//           myEmail: bidEmail,
//           // secrets
//           clientId: calenders[0]?.GOOGLE_CLIENT_ID,
//           clientSecret: calenders[0]?.GOOGLE_CLIENT_SECRET,
//           refreshToken: calenders[0]?.GOOGLE_REFRESH_TOKEN,
//           customerDetails: customerDetails,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to get response");
//       }

//       toast({
//         variant: "default",
//         title: "Email Reply Sent Successfuly",
//         description: "",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "An Error Occurred While replying to email",
//         description: "",
//       });
//       console.error("Error:", error);
//     }
//   };

//   const refresh = async () => {
//     // const data2 = (await FetchEmails()) as any[];
//     // setData(data2);
//     // setMails(data2);
//     if (data.length > 0) {
//       // const bid = session?.user?.id;
//       const from = data[0]?.email;
//       const to = data[0]?.to;
//       const subject = data[0]?.subject;
//       const text = data[0]?.text;

//       const { messages, userId, productId } = await findChatsForEmail(
//         from,
//         bid
//       );

//       const customerDetails = await getSingleUsers(userId);
//       const calenders = await getAllCalenders(bid);

//       const productDetails = products.find(
//         (product) => product._id === productId
//       );

//       const userMessage = {
//         userId: userId,
//         bId: bid,
//         productId: productId,
//         role: "user",
//         content: text,
//       };

//       const finalMessages = [...messages, userMessage];

//       await sendMessage(
//         finalMessages,
//         productId,
//         userId,
//         bid,
//         productDetails,
//         customerDetails,
//         calenders
//       );
//     }
//   };

//   return (
//     <TooltipProvider delayDuration={0}>
//       <ResizablePanelGroup
//         direction="horizontal"
//         onLayout={(sizes: number[]) => {
//           document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
//             sizes
//           )}`;
//         }}
//         className="h-full max-h-[800px] items-stretch"
//       >
//         <ResizableHandle withHandle />
//         <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
//           <Tabs defaultValue="all">
//             <div className="flex items-center px-4 py-2">
//               <h1 className="text-xl font-bold">Inbox</h1>
//               <TabsList className="ml-auto">
//                 <Button
//                   className="bg-black text-white hover:bg-slate-500 mr-4"
//                   onClick={refresh}
//                 >
//                   Refresh
//                 </Button>
//                 <TabsTrigger
//                   value="all"
//                   className="text-zinc-600 dark:text-zinc-200"
//                 >
//                   All mail
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="unread"
//                   className="text-zinc-600 dark:text-zinc-200"
//                 >
//                   Unread
//                 </TabsTrigger>
//               </TabsList>
//             </div>
//             {/* Personalized Athletic Sneakers */}
//             <Separator />
//             <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//               <form>
//                 <div className="relative">
//                   <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input placeholder="Search" className="pl-8" />
//                 </div>
//               </form>
//             </div>
//             <TabsContent value="all" className="m-0">
//               <MailList items={mails} />
//             </TabsContent>
//             <TabsContent value="unread" className="m-0">
//               <MailList items={mails?.filter((item) => !item.read)} />
//             </TabsContent>
//           </Tabs>
//         </ResizablePanel>
//         <ResizableHandle withHandle />
//         <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
//           <MailDisplay
//             mail={mails.find((item) => item.id === mail.selected) || null}
//           />
//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </TooltipProvider>
//   );
// }

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
// import { type Mail } from "../data"; // Assuming Mail type might be needed elsewhere
import { useMail } from "../use-mail";
import { Button } from "@/components/ui/button";
import {
  findChatsForEmail,
  getChats,
  getSingleUsers,
} from "@/actions/fetch.actions";
import { getAllCalenders } from "@/actions/calender.action";
// import FetchEmails from "@/lib/fetchEmail"; // Commented out as there's another FetchEmails import
import { useAppSelector } from "@/redux/hooks";
import { selectProducts } from "@/redux/slices/product";
import { useSession } from "next-auth/react";
import FetchEmails from "@/actions/fetchEmail";
import { toast } from "react-toastify";

import {
  getDiscounts,
  getInvoices,
  getMeetings,
} from "@/actions/fetch.actions";

import { setdiscounts } from "@/redux/slices/discount";
import { useDispatch } from "react-redux";
import { selectchats, setchats } from "@/redux/slices/chat";
import { selectusers } from "@/redux/slices/user";
import { setinvoices } from "@/redux/slices/invoice";
import { getGenerations } from "@/actions/generate.actions";
import { setgenerations } from "@/redux/slices/generate";
import { setmeetings } from "@/redux/slices/meeting";
import { selectProductId } from "@/redux/slices/productId";

export function Mail() {
  const [mails, setMails] = useState<any>([]);
  const [data, setData] = useState<any>([]); // This state seems to hold the same as 'mails'. Consider if it's needed.
  const [mail] = useMail();
  const { data: session } = useSession();
  const bid = session?.user?.id;
  const bidEmail = session?.user.email;
  const defaultLayout = [20, 32, 48];
  const products = useAppSelector(selectProducts);
  const dispatch = useDispatch();
  const productId = useAppSelector(selectProductId);

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

  // ------------------- Update Chat Messages --------------------------
  const updateChats = async (id) => {
    try {
      const chats = await getChats(id);
      dispatch(setchats(chats));
    } catch (error) {
      console.log("An Error Occured");
    }
  };

  const sendMessage = async (
    messages,
    // productId,
    userId,
    bId,
    productDetails,
    customerDetails,
    calenders
  ) => {
    try {
      const url = // Removed NEXTAUTH_URL, assuming it's for the API route within the same app
        process.env.NODE_ENV == "development"
          ? "/api/chat" // Relative path for API route
          : `${process.env.NEXT_PUBLIC_APP_URL}/api/chat`; // Full URL for production

      console.log("Mail calenders:", calenders);

      const response = await fetch(url, {
        // Use the defined url variable
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
          customerName: customerDetails?.name,
          userEmail: customerDetails?.email,
          myEmail: bidEmail,
          clientId: calenders[0]?.GOOGLE_CLIENT_ID,
          clientSecret: calenders[0]?.GOOGLE_CLIENT_SECRET,
          refreshToken: calenders[0]?.GOOGLE_REFRESH_TOKEN,
          customerDetails: customerDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response, status: ${response.status}`);
      }
      const data = await response.json();
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

      // update chat messages
      updateChats(bid);
      toast.success("Email Reply Sent Successfully");
    } catch (error) {
      toast.error("An Error Occurred While replying to email");
      console.error("Error sending message:", error);
    }
  };

  const processAutoReply = async (emailsToProcess) => {
    if (emailsToProcess && emailsToProcess.length > 0) {
      // Assuming you want to auto-reply to the first email in the list for this example
      // You might want to iterate or have more specific logic here
      const firstEmail = emailsToProcess[0];
      const from = firstEmail?.email; // const to = firstEmail?.to; // 'to' is not used in findChatsForEmail // const subject = firstEmail?.subject; // 'subject' is not used
      const text = firstEmail?.text;

      if (!bid) {
        console.log("Business ID (bid) is not available. Cannot auto-reply.");
        return;
      }
      if (!from || !text) {
        console.log(
          "Email 'from' or 'text' is missing. Cannot auto-reply.",
          firstEmail
        );
        return;
      }

      try {
        // returns productId here also
        const { messages, userId } = await findChatsForEmail(from, bid);

        if (!userId || !productId) {
          console.log("Could not find chat details for email. No auto-reply.", {
            from,
            bid,
          });
          // Optionally, you could send a generic reply or log this for manual review
          return;
        }

        const customerDetails = await getSingleUsers(userId);
        const calenders = await getAllCalenders(bid);

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

        console.log("Attempting auto-reply for email from:", from);
        await sendMessage(
          finalMessages,
          // productId,
          userId,
          bid,
          productDetails,
          customerDetails,
          calenders
        );
      } catch (error) {
        console.error(
          "Error during auto-reply process for email from:",
          from,
          error
        );
        toast.error("Auto-reply Failed");
      }
    } else {
      console.log(
        "No emails to process for auto-reply or emailsToProcess is undefined."
      );
    }
  };

  // auto reply useEffect
  const effectRan = useRef(false); // Our flag
  useEffect(() => {
    if (effectRan.current === true) {
      console.log("useEffect: Already ran, skipping.");
      return;
    }

    const getEmailsAndAutoReply = async () => {
      const id = toast.loading("Fetching Emails....");
      try {
        console.log("Fetching emails...");
        const fetchedEmails = await FetchEmails();
        console.log("Fetched emails:", fetchedEmails);
        setMails(fetchedEmails);
        setData(fetchedEmails); // Consider if 'data' state is still necessary // Check for auto-reply condition

        toast.update(id, {
          render: "Emails Feched",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        console.log(
          "process.env.NEXT_PUBLIC_AUTOREPLY:",
          process.env.NEXT_PUBLIC_AUTOREPLY
        );
        if (process.env.NEXT_PUBLIC_AUTOREPLY === "true" && fetchedEmails) {
          console.log("Auto-reply conditions met. Processing auto-reply...");
          await processAutoReply(fetchedEmails); // Pass fetched emails to the auto-reply function
        } else {
          console.log("Auto-reply conditions not met.");
          if (process.env.NEXT_PUBLIC_AUTOREPLY !== "true") {
            console.log(
              "Auto-reply is not enabled (NEXT_PUBLIC_AUTOREPLY is not 'true')."
            );
          }
          if (!fetchedEmails) {
            console.log("No emails fetched to auto-reply to.");
            toast.warn("No New Emails Found");
          }
        }
      } catch (error) {
        console.error("An Error Occurred Fetching the Emails:", error); // Changed console.log to console.error
        toast.update(id, {
          render: "Error Fetching Emails",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    };

    getEmailsAndAutoReply();
    // Mark that the effect has run
    // This will persist across the unmount/remount cycle of Strict Mode
    return () => {
      console.log(
        "useEffect: Cleanup function running. Setting effectRan.current to true for next mount in Strict Mode."
      );
      effectRan.current = true;
    };
  }, []); // Added products and bid as dependencies if they are used in processAutoReply indirectly or directly

  const refreshManually = async () => {
    // Renamed to avoid confusion with the auto-reply logic trigger
    console.log(
      "Manual refresh initiated. Processing reply for the first email in 'data'."
    );
    // The existing refresh logic assumes 'data' state is populated and uses its first item.
    // This might need adjustment if 'data' can be empty or if a specific email should be targeted.
    if (data && data.length > 0) {
      await processAutoReply(data); // Reuse the auto-reply logic for manual refresh
    } else {
      toast.error("No Emails Loaded");
      console.log("No data available to refresh manually.");
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <Button
                  className="bg-black text-white hover:bg-slate-500 mr-4"
                  onClick={refreshManually}
                >
                  Refresh
                </Button>
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
              <MailList items={mails?.filter((item) => !item.read)} />
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
  );
}
