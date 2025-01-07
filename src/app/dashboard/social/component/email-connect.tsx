'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmailConnectForm } from './email-connect-form'

export function EmailConnect() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-black text-white hover:bg-blue-950'>
          <Mail className="mr-2 h-4 w-4" /> Connect to Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect to Email Server</DialogTitle>
        </DialogHeader>
        <EmailConnectForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

