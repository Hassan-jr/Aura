"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DeliveryType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DeliveryHistoryProps {
  deliveries: DeliveryType[]
  onResend: (id: string) => void
}

export function DeliveryHistory({ deliveries, onResend }: DeliveryHistoryProps) {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType | null>(null)

  const getEventName = (delivery: DeliveryType) => {
    switch (delivery.event) {
      case "discountSent":
        return "Discount is sent"
      case "invoiceIssued":
        return "Invoice issued"
      case "postGenerated":
        return "Post generated"
      case "meetingScheduled":
        return "Meeting scheduled"
      default:
        return delivery.event
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent deliveries</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md">
          <ScrollArea className="h-[400px]">
            {deliveries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">No recent deliveries</div>
            ) : (
              <div className="divide-y">
                {deliveries.map((delivery) => (
                  <div
                    key={delivery._id}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedDelivery?._id === delivery._id && "bg-muted",
                    )}
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    {delivery.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{getEventName(delivery)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(delivery.timestamp), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="border rounded-md p-4">
          {selectedDelivery ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{getEventName(selectedDelivery)}</h3>
                <Button variant="outline" size="sm" onClick={() => onResend(selectedDelivery._id)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Webhook URL</p>
                <p className="text-sm text-muted-foreground break-all">{selectedDelivery.url}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Response</p>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      selectedDelivery.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                    )}
                  >
                    {selectedDelivery.statusCode || "Error"}
                  </span>
                  <span className="text-sm text-muted-foreground">{selectedDelivery.message || "No message"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Payload</p>
                <div className="bg-muted p-3 rounded-md overflow-auto max-h-[200px]">
                  <pre className="text-xs">{JSON.stringify(selectedDelivery.payload, null, 2)}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a delivery to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
