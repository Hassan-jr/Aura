'use client'
import { useSession } from "next-auth/react";
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { addProduct } from '@/actions/addproduct.action'
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  maxDiscountRate: z.number().min(0).max(100, 'Discount rate must be between 0 and 100'),
  bargainingPower: z.number().min(0).max(1, 'Bargaining power must be between 0 and 1'),
})

export function AddProductDialog() {
  const [open, setOpen] = useState(false)
const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      maxDiscountRate: 40,
      bargainingPower: 0.7,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (
        values.title &&
        values.price !== undefined &&
        values.description &&
        values.maxDiscountRate !== undefined &&
        values.bargainingPower !== undefined
      ) {
        await addProduct({
          title: values.title,
          price: values.price,
          description: values.description,
          maxDiscountRate: values.maxDiscountRate,
          bargainingPower: values.bargainingPower,
          userId:  session.user.id,
        })
        form.reset()
        setOpen(false)
        toast({
            variant: "default",
            title: "Product Added successful",
            description: '',
          });
      } else {
        console.error('All fields are required')
        // Optionally, you can set an error state or show a message to the user
      }
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"  className='bg-black text-white'>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed product description. You can use Markdown for formatting."
                      className="h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    You can use Markdown for headers, bullet points, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxDiscountRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Discount Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" step="1" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bargainingPower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bargaining Power</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="1" step="0.1" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit"  className='bg-black text-white w-full'>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

