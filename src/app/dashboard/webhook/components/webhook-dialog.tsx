"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { WebhookType } from "@/lib/types"

interface WebhookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  webhook: WebhookType | null
  onSave: (webhook: WebhookType) => void
}

export function WebhookDialog({ open, onOpenChange, webhook, onSave }: WebhookDialogProps) {
  const [url, setUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [events, setEvents] = useState({
    discountSent: false,
    invoiceIssued: false,
    postGenerated: false,
    meetingScheduled: false,
  })

  useEffect(() => {
    if (webhook) {
      setUrl(webhook.url)
      setSecret(webhook.secret)
      setEvents(webhook.events)
    } else {
      setUrl("")
      setSecret("")
      setEvents({
        discountSent: false,
        invoiceIssued: false,
        postGenerated: false,
        meetingScheduled: false,
      })
    }
  }, [webhook, open])

  const handleSave = () => {
    const newWebhook: WebhookType = {
      _id: webhook?._id || undefined,
      url,
      secret,
      events,
      createdAt: webhook?.createdAt || new Date().toISOString(),
    }

    onSave(newWebhook)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{webhook ? "Edit Webhook" : "Add Webhook"}</DialogTitle>
          <DialogDescription>Configure a webhook to receive notifications when events occur.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Callback URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook"
            />
            <p className="text-sm text-muted-foreground">
              A POST request will be sent to this URL every time an event is triggered in the app
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="secret">Signing Secret</Label>
            <Input id="secret" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="whsec_..." />
            <p className="text-sm text-muted-foreground">
              A secret that will be used to sign each request. Used to verify the webhook is sent from the app via the
              X-Signature header
            </p>
          </div>
          <div className="grid gap-2">
            <Label>What updates should we send?</Label>
            <div className="grid gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="discountSent"
                  checked={events.discountSent}
                  onCheckedChange={(checked) => setEvents({ ...events, discountSent: checked === true })}
                />
                <Label htmlFor="discountSent">Discount is sent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="invoiceIssued"
                  checked={events.invoiceIssued}
                  onCheckedChange={(checked) => setEvents({ ...events, invoiceIssued: checked === true })}
                />
                <Label htmlFor="invoiceIssued">Invoice issued</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="postGenerated"
                  checked={events.postGenerated}
                  onCheckedChange={(checked) => setEvents({ ...events, postGenerated: checked === true })}
                />
                <Label htmlFor="postGenerated">Post generated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="meetingScheduled"
                  checked={events.meetingScheduled}
                  onCheckedChange={(checked) => setEvents({ ...events, meetingScheduled: checked === true })}
                />
                <Label htmlFor="meetingScheduled">Meeting scheduled</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button className="bg-red-600 hover:bg-red-500" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500" onClick={handleSave}>Save Webhook</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
