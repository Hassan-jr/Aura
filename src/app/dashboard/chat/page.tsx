import { AIChat } from "@/components/chat/ai-chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscountCards from "@/components/discounts/discount";
import InvoiceCards from "@/components/invoice/invoice";
import MeetingCard from "@/components/meeting/meeting-card";
import GenerationCards from "@/app/create/gen/generation-card";

export default function ChatPage() {
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
            <AIChat />
          </div>
        </TabsContent>
        <TabsContent value="discounts">
          <DiscountCards />
        </TabsContent>
        <TabsContent value="invoices">
          <InvoiceCards />
        </TabsContent>
        <TabsContent value="meetings">
          <MeetingCard />
        </TabsContent>

        <TabsContent value="images">
          <GenerationCards />
        </TabsContent>
      </Tabs>
    </div>
  );
}
