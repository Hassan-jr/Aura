"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import { getSingleProducts, getUserDiscount } from "@/actions/fetch.actions";
import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";

// Sample product data
const product = {
  title: "Premium Wireless Headphones",
  description: `
# Premium Wireless Headphones

These premium wireless headphones deliver exceptional sound quality with deep bass and crystal-clear highs. Perfect for music enthusiasts and professionals alike.

## Key Features

- **Active Noise Cancellation**: Block out external noise for immersive listening
- **40-Hour Battery Life**: Extended playtime on a single charge
- **Premium Materials**: Memory foam ear cushions and stainless steel frame
- **Bluetooth 5.2**: Stable connection with minimal latency
- **Built-in Microphone**: Crystal clear calls with noise reduction

## Technical Specifications

- Frequency Response: 20Hz - 20kHz
- Impedance: 32 Ohm
- Driver Size: 40mm
- Weight: 250g

These headphones are designed for comfort during extended listening sessions. The adjustable headband and rotating ear cups ensure a perfect fit for any head size.
  `,
  price: 299.99,
  discount: 15, // percentage
  images: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNob2VzfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNob2VzfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1570464197285-9949814674a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNob2VzfGVufDB8fDB8fHww",
  ],
};

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );
  const [productData, setProductData] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
   const { data: session } = useSession();
   const   userId = session?.user?.id;
   const [discount, setDiscount] = useState({})

  // Unwrap the params Promise and update state
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await params;
        setUnwrappedParams(resolvedParams);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };

    fetchParams();
  }, [params]);

  // Fetch product data once params are available
//   getUserDiscount
  useEffect(() => {
    if (unwrappedParams?.id) {
      const getData = async () => {
        try {
          const data = await getSingleProducts(unwrappedParams.id);
          
          setProductData(data);
         
          
        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      };

      getData();
    }
  }, [unwrappedParams]);


//   discount
useEffect(() => {
    if (unwrappedParams?.id) {
      const getData = async () => {
        try {
          const data = await getUserDiscount(userId, unwrappedParams.id);
          
          setDiscount(data);
          
        } catch (error) {
          console.error("Error fetching product data:", error);
        }
      };

      getData();
    }
  }, [unwrappedParams, userId]);

  if (!unwrappedParams || !productData) {
    return <div>Loading...</div>; // Display loading state until data is available
  }

  // Calculate the discounted price
  const discountedPrice = discount?.agreedDiscountRate ? 
  productData?.price - productData?.price * (discount?.agreedDiscountRate / 100) :  productData?.price;
  const total = discountedPrice * quantity;

  // Handle quantity changes
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Truncate description for mobile view
  const shortDescription = productData?.description?
    .split("\n")
    .slice(0, 4)
    .join("\n");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {productData?.title} {userId}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images - Left Column */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={`${product.title} - View ${selectedImageIndex + 1}`}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                  selectedImageIndex === index
                    ? "border-primary"
                    : "border-muted"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details - Right Column */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Product Description */}
            <div className="prose prose-sm max-w-none">
              <div className="md:block">
                {/* On mobile: Show truncated description with "See More" button */}
                <div className="md:hidden">
                  <ReactMarkdown>
                    {showFullDescription
                      ? product.description
                      : shortDescription}
                  </ReactMarkdown>
                  {!showFullDescription && (
                    <Button
                      variant="link"
                      onClick={() => setShowFullDescription(true)}
                      className="p-0 h-auto text-primary"
                    >
                      See More
                    </Button>
                  )}
                </div>

                {/* On desktop: Always show full description */}
                <div className="hidden md:block">
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
              </div>
            </div>

            <Separator />

            {/* Price Information */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${productData.price?.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium text-green-600">
                  {discount?.agreedDiscountRate ? discount?.agreedDiscountRate : "0"}% OFF
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantity:</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button className="w-full bg-blue-500 hover:bg-blue-400" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
