'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, PackageIcon, UserIcon, DollarSignIcon, PercentIcon } from 'lucide-react'


export default function InvoiceCards({invoices, users, products, discounts}) {
  const currentDate = new Date();

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => {
        const user = users.find(u => u._id === invoice.userId)
        const product = products.find(p => p._id === invoice.productId)
        const discount = discounts.find(d => d.productId === invoice.productId && d.userId === invoice.userId)
        const expiryDate = new Date(invoice.expiryDate);
        const isActive = expiryDate > currentDate;

        const totalCost = product ? product.price * invoice.qty : 0;
        const discountedCost = discount ? totalCost * (1 - discount.agreedDiscountRate / 100) : totalCost;

        return (
          <Card key={invoice._id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl">
                    Invoice #{invoice._id}
                  </CardTitle>
                  <Badge variant={isActive ? "outline" : "destructive"} className={isActive ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                    {isActive ? "Active" : "Expired"}
                  </Badge>
                </div>
                <Badge variant="outline">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  Expires {expiryDate.toLocaleDateString()}
                </Badge>
              </div>
              <CardDescription>
                Created on {new Date(invoice.createdAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={user?.profileUrl} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Username: {user?.username}</span>
                </div>
                <div className="flex items-center">
                  <PackageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Product: {product?.title}</span>
                </div>
                <div className="flex items-center">
                  <DollarSignIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Quantity: {invoice.qty}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Account Type: {user?.accountType}</span>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-2">Cost Breakdown</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <DollarSignIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Cost: ${totalCost.toFixed(2)}</span>
                  </div>
                  {discount && (
                    <>
                      <div className="flex items-center">
                        <PercentIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Discount: {discount.agreedDiscountRate}%</span>
                      </div>
                      <div className="flex items-center col-span-2">
                        <DollarSignIcon className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                          Discounted Cost: ${discountedCost.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

