"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { WebhookType } from "@/lib/types"

interface WebhookTableProps {
  webhooks: WebhookType[]
  onEdit: (webhook: WebhookType) => void
  onDelete: (id: string) => void
}

export function WebhookTable({ webhooks, onEdit, onDelete }: WebhookTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">URL</TableHead>
            <TableHead>Listening for</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webhooks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                No webhooks configured yet
              </TableCell>
            </TableRow>
          ) : (
            webhooks.map((webhook) => (
              <TableRow key={webhook._id}>
                <TableCell className="font-medium">{webhook.url}</TableCell>
                <TableCell>{countEvents(webhook)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(webhook)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDelete(webhook._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function countEvents(webhook: WebhookType): number {
  return Object.entries(webhook.events).filter(([_, value]) => value).length - 1
}
