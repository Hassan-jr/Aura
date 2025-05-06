import { AIChat } from "@/components/chat/ai-chat";
import { connect } from "@/db";
import { ChatMessage } from "@/modals/chatMessage.modal";
import { auth } from "@/app/auth";
import { Message } from "@/components/chat/types";
import User from "@/modals/user.modal";
import { Product } from "@/modals/product.modal";
import { Discount } from "@/modals/discount.modal";
import { Invoice } from "@/modals/invoice.modal";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscountCards from "@/components/discounts/discount";
import InvoiceCards from "@/components/invoice/invoice";
import { ObjectId } from "mongodb";
import MeetEvent from "@/modals/meet.modal";
import MeetingCard from "@/components/meeting/meeting-card";
import GenerationCards from "@/app/create/gen/generation-card";

// chats
async function getChats(id: string) {
  await connect();
  const messages = await ChatMessage.find({ bId: id })
    .sort({ createdAt: +1 })
    .lean();

  const uniqueUserIds = Array.from(
    new Set(messages.map((msg) => msg.userId.toString()))
  );
  const users = await User.find({ _id: { $in: uniqueUserIds } }).lean();

  const finalUsers = users.map((user) => ({
    ...user,
    _id: user._id.toString(), // Convert _id to string
    createdAt: user.createdAt.toISOString(), // Convert Date to ISO string
    updatedAt: user.updatedAt.toISOString(), // Convert Date to ISO string
  }));

  const finalMessages = messages.map((msg) => ({
    ...msg,
    _id: msg._id.toString(), // Convert _id to string
    createdAt: msg.createdAt.toISOString(), // Convert Date to ISO string
    updatedAt: msg.updatedAt.toISOString(), // Convert Date to ISO string
  }));

  return {
    finalUsers,
    finalMessages,
  };
}

// products
async function getProducts(id: string) {
  await connect();
  const products = await Product.find({ userId: id })
    .sort({ createdAt: +1 })
    .lean();
  const finalProducts = products.map((product) => ({
    ...product,
    _id: product._id.toString(), // Convert _id to string
    createdAt: product.createdAt.toISOString(), // Convert Date to ISO string
    updatedAt: product.updatedAt.toISOString(), // Convert Date to ISO string
  }));

  return finalProducts;
}

// discounts
async function getDiscounts(id: string) {
  await connect();
  const Discounts = await Discount.find({ bId: id })
    .sort({ createdAt: -1 })
    .lean();

  const uniqueUserIds = Array.from(
    new Set(Discounts.map((msg) => msg.userId.toString()))
  );
  const users = await User.find({ _id: { $in: uniqueUserIds } }).lean();

  const DiscountUsers = users.map((user) => ({
    ...user,
    _id: user._id.toString(), // Convert _id to string
    createdAt: user.createdAt.toISOString(), // Convert Date to ISO string
    updatedAt: user.updatedAt.toISOString(), // Convert Date to ISO string
  }));

  const finalDiscounts = Discounts.map((msg) => ({
    ...msg,
    _id: msg._id.toString(), // Convert _id to string
    createdAt: msg.createdAt.toISOString(), // Convert Date to ISO string
    updatedAt: msg.updatedAt.toISOString(), // Convert Date to ISO string
  }));

  return {
    DiscountUsers,
    finalDiscounts,
  };
}

// invoices
async function getInvoices(id: string) {
  await connect();
  const Invoices = await Invoice.find({ bId: id })
    .sort({ createdAt: -1 })
    .lean();

  const uniqueUserIds = Array.from(
    new Set(Invoices.map((msg) => msg.userId.toString()))
  );
  const users = await User.find({ _id: { $in: uniqueUserIds } }).lean();

  const InvoicesUsers = users.map((user) => ({
    ...user,
    _id: user._id.toString(), // Convert _id to string
    createdAt: user.createdAt.toISOString(), // Convert Date to ISO string
    updatedAt: user.updatedAt.toISOString(), // Convert Date to ISO string
  }));

  const finalInvoices = Invoices.map((msg) => ({
    ...msg,
    _id: msg._id.toString(), // Convert _id to string
    createdAt: msg.createdAt.toISOString(), // Convert Date to ISO string
    updatedAt: msg.updatedAt.toISOString(), // Convert Date to ISO string
  }));

  return {
    InvoicesUsers,
    finalInvoices,
  };
}

// get meetings
async function getMeetings(id) {
  await connect();
  const meetings = await MeetEvent.find({ bid: id })
    .sort({ createdAt: -1 })
    .lean();

  return meetings;
}
export default async function ChatPage() {
  const session = await auth();
  const { finalUsers, finalMessages } = await getChats(session?.user?.id);
  const finalProducts = await getProducts(session?.user?.id);
  const { DiscountUsers, finalDiscounts } = await getDiscounts(
    session?.user?.id
  );

  const { InvoicesUsers, finalInvoices } = await getInvoices(session?.user?.id);
  const meetings = await getMeetings(session?.user?.id);

  return (
    <div className="mx-5">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account">Customer Engagement</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="images">Product Images</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="container mx-auto">
            <AIChat
              prevmessages={finalMessages}
              users={finalUsers}
              products={finalProducts}
              bid={session?.user?.id}
            />
          </div>
        </TabsContent>
        <TabsContent value="discounts">
          <DiscountCards discounts={finalDiscounts} users={DiscountUsers} />
        </TabsContent>
        <TabsContent value="invoices">
          <InvoiceCards
            invoices={finalInvoices}
            products={finalProducts}
            discounts={finalDiscounts}
            users={InvoicesUsers}
          />
        </TabsContent>
        <TabsContent value="meetings">
          <MeetingCard
            meetings={meetings}
            users={finalUsers}
            products={finalProducts}
          />
        </TabsContent>

        <TabsContent value="images">
          <GenerationCards />
        </TabsContent>
      </Tabs>
    </div>
  );
}
