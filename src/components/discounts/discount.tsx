"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  PercentIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { selectProductId } from "@/redux/slices/productId";
import { useEffect, useState } from "react";

export default function DiscountCards({ discounts, users }) {
  const currentDate = new Date();

  const productId = useAppSelector(selectProductId);

  const [productDiscounts, setproductDiscounts] = useState([]);

  useEffect(() => {
    const filteredPosts = discounts?.filter(
      (dis) => dis.productId == productId
    );
    setproductDiscounts(filteredPosts);
  }, [productId]);

  return (
    <div className="space-y-4">
      {productDiscounts.map((discount) => {
        const user = users.find((u) => u._id === discount.userId);
        const expiryDate = new Date(discount.expiryDate);
        const isActive = expiryDate > currentDate;

        return (
          <Card key={discount._id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-2xl">
                    {discount.agreedDiscountRate}% Discount
                  </CardTitle>
                  <Badge
                    variant={isActive ? "outline" : "destructive"}
                    className={
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }
                  >
                    {isActive ? "Active" : "Expired"}
                  </Badge>
                </div>
                <Badge variant="outline">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  Expires {expiryDate.toLocaleDateString()}
                </Badge>
              </div>
              <CardDescription>
                Created on {new Date(discount.createdAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user?.profileUrl} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Username: {user?.username}</span>
                </div>
                <div className="flex items-center">
                  <ShoppingBagIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Product ID: {discount.productId}
                  </span>
                </div>
                <div className="flex items-center">
                  <PercentIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Discount Rate: {discount.agreedDiscountRate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* no posts */}
      {productDiscounts.length == 0 && (
        <Card className="p-5 w-64 mx-auto">No discounts available for this product</Card>
      )}
    </div>
  );
}
