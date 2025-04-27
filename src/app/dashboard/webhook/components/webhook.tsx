"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebhookTable } from "./webhook-table";
import { WebhookDialog } from "./webhook-dialog";
import { DeliveryHistory } from "./delivery-history";
import type { WebhookType, DeliveryType } from "@/lib/types";
import { toast } from "react-toastify";

export function Webhook() {
  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookType | null>(
    null
  );

  useEffect(() => {
    // Fetch webhooks from API
    fetchWebhooks();
    fetchDeliveries();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const response = await fetch("/api/webhooks");
      const data = await response.json();
      setWebhooks(data);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries");
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  const handleSaveWebhook = async (webhook: WebhookType) => {
    const id = toast.loading("Saving Webhook.. Please wait...");
    try {
      const method = webhook._id ? "PUT" : "POST";
      const url = webhook._id
        ? `/api/webhooks/${webhook._id}`
        : "/api/webhooks";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhook),
      });

      if (response.ok) {
        console.log("Webhook saved:", webhook);
        fetchWebhooks();
        setIsDialogOpen(false);
        setEditingWebhook(null);
        toast.update(id, {
          render: "Webhook Saved",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error saving webhook:", error);
      toast.update(id, {
        render: "An Error Occured",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleEditWebhook = (webhook: WebhookType) => {
    setEditingWebhook(webhook);
    setIsDialogOpen(true);
  };

  const handleDeleteWebhook = async (id: string) => {
    const id2 = toast.loading("Saving Webhook.. Please wait...");
    try {
      const response = await fetch(`/api/webhooks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Webhook deleted:", id);
        fetchWebhooks();
        toast.update(id2, {
          render: "Webhook Deleted Successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error deleting webhook:", error);
      toast.update(id2, {
        render: "An Error Occured While Deleting Webhook",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleResendDelivery = async (deliveryId: string) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/resend`, {
        method: "POST",
      });

      if (response.ok) {
        console.log("Webhook delivery resent:", deliveryId);
        fetchDeliveries();
      }
    } catch (error) {
      console.error("Error resending webhook delivery:", error);
    }
  };

  const testDelivary = async () => {
    // addDelivery
    try {
      const webhook = {
        webhookId: "680caaff2a97e3675d7ca41d",
        event: "discount_sent",
        payload: {
          user: {
            userId: "1234",
            username: "hassanjr",
            email: "abdi@gmail.com",
          },
          product: {
            name: "test product",
            price: 200,
          },
          discount: {
            percentage: "20%",
            value: 300,
            due: new Date(),
          },
        },
      };

      // send devliary
      const response = await fetch("/api/deliveries/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhook),
      });
    } catch (error) {
      console.log("EEE: ", error);
    }
  };
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Webhooks</h1>
        <Button variant="outline" onClick={testDelivary}>
          TEST DELIVARY
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setEditingWebhook(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      </div>

      <WebhookTable
        webhooks={webhooks}
        onEdit={handleEditWebhook}
        onDelete={handleDeleteWebhook}
      />

      <WebhookDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        webhook={editingWebhook}
        onSave={handleSaveWebhook}
      />

      <DeliveryHistory
        deliveries={deliveries}
        onResend={handleResendDelivery}
      />
    </div>
  );
}
