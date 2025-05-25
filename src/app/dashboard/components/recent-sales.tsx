"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Percent, Package, DollarSign } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectdiscounts } from "@/redux/slices/discount";
import { selectinvoices } from "@/redux/slices/invoice";
import { selectProducts } from "@/redux/slices/product";
import { selectProductId } from "@/redux/slices/productId";
import { selectusers } from "@/redux/slices/user";
import { useSession } from "next-auth/react";

// Dummy data matching your schemas
const users = [
  {
    _id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    image: "/avatars/01.png",
  },
  {
    _id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    image: "/avatars/02.png",
  },
  {
    _id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    image: "/avatars/03.png",
  },
  {
    _id: "4",
    name: "William Kim",
    email: "will@email.com",
    image: "/avatars/04.png",
  },
  {
    _id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    image: "/avatars/05.png",
  },
];

interface RecentSalesProps {
  isInvoice: boolean;
}

export function RecentSales({ isInvoice }: RecentSalesProps) {
  // Simulate current user session
  const { data: session } = useSession();
  const currentUserId = session.user.id;

  const invoices = useAppSelector(selectinvoices);
  const products = useAppSelector(selectProducts);
  const discounts = useAppSelector(selectdiscounts);
  const users = useAppSelector(selectusers);

  // Filter products for current user
  const userProducts = products.filter(
    (product) => product.userId === currentUserId
  );

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(dateObj);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isExpiringSoon = (expiryDate: Date) => {
    const today = new Date();
    const expiry =
      typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (expiryDate: Date) => {
    const expiry =
      typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
    return expiry < new Date();
  };

  if (isInvoice) {
    return (
      <div className="space-y-6">
        {invoices.map((invoice, index) => {
          const user = users.find((u) => u._id === invoice.userId);
          const product = userProducts.find((p) => p._id === invoice.productId);

          if (!user || !product) return null;

          const total = product.price * invoice.qty;
          const expired = isExpired(invoice.expiryDate);
          const expiringSoon = isExpiringSoon(invoice.expiryDate);

          return (
            <div
              key={invoice._id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Package className="w-3 h-3 mr-1" />
                      Qty: {invoice.qty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {formatDate(invoice.expiryDate)}</span>
                    {expired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                    {expiringSoon && !expired && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-yellow-100 text-yellow-800"
                      >
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center text-lg font-semibold text-green-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  KES {total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  KES {product.price.toLocaleString()} × {invoice.qty}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Discount cards
  return (
    <div className="space-y-6">
      {discounts.map((discount, index) => {
        const user = users.find((u) => u._id === discount.userId);
        const product = userProducts.find((p) => p._id === discount.productId);

        if (!user || !product) return null;

        const discountAmount =
          (product.price * discount.agreedDiscountRate) / 100;
        const finalPrice = product.price - discountAmount;
        const expired = isExpired(discount.expiryDate);
        const expiringSoon = isExpiringSoon(discount.expiryDate);

        return (
          <div
            key={discount._id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Percent className="w-3 h-3 mr-1" />
                    {discount.agreedDiscountRate}% OFF
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{product.title}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Expires: {formatDate(discount.expiryDate)}</span>
                  {expired && (
                    <Badge variant="destructive" className="text-xs">
                      Expired
                    </Badge>
                  )}
                  {expiringSoon && !expired && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-yellow-100 text-yellow-800"
                    >
                      Expiring Soon
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center text-lg font-semibold text-green-600">
                <DollarSign className="w-4 h-4 mr-1" />
                KES {finalPrice.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="line-through">
                  KES {product.price.toLocaleString()}
                </span>
                <span className="ml-2 text-red-600 font-medium">
                  -KES {discountAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
