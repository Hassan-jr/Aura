import { AIChat } from "@/components/chat/ai-chat-user";
import { connect } from "@/db";
import { ChatMessage } from "@/modals/chatMessage.modal";
import { auth } from "@/app/auth";
import User from "@/modals/user.modal";
import { Product } from "@/modals/product.modal";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navheader from "@/customui/navheader";

async function getChats(id: string) {
  await connect();
  const messages = await ChatMessage.find({ userId: id })
    .sort({ createdAt: +1 })
    .lean();

  const uniqueBIds = Array.from(
    new Set(messages.map((msg) => msg.bId.toString()))
  );
  const users = await User.find({ _id: { $in: uniqueBIds } }).lean();

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
    uniqueBIds,
  };
}

async function getProducts(uniqueBIds) {
  await connect();
  const products = await Product.find({ userId: { $in: uniqueBIds } })
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

export default async function ChatPage() {
  const session = await auth();
  const { finalUsers, finalMessages, uniqueBIds } = await getChats(
    session?.user?.id
  );
  const products = await getProducts(uniqueBIds);
  return (
    <Navheader>
      <SidebarProvider>
        <div className="container mx-auto py-8">
          <AIChat
            prevmessages={finalMessages}
            users={finalUsers}
            products={products}
          />
        </div>
      </SidebarProvider>
    </Navheader>
  );
}
