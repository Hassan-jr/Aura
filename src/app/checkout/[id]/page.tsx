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
import { useAppSelector } from "@/redux/hooks";
import { selectloras } from "@/redux/slices/lora";
// import { useRouter } from "next/router";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );
  const [productData, setProductData] = useState<any>({}); //useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [discount, setDiscount] = useState<any>({}); //useState({})
  // @@@@@@@@@@
  const lorasData = useAppSelector(selectloras);
  const [trainUrls, setTrainUrls] = useState([]);
  const [images, setImages] = useState(
    trainUrls?.length > 0
      ? trainUrls
      : ["https://r2.nomapos.com/CSC416/loadingImage.svg"]
  );

  const [currentLora, setCurrentLora] = useState(
    lorasData.find((lora) => lora.productId == unwrappedParams?.id)
  );

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  useEffect(() => {
    if (unwrappedParams?.id && lorasData) {
      const lora = lorasData.find(
        (lora) => lora.productId == unwrappedParams?.id
      );
      setCurrentLora(lora);
    }
  }, [lorasData, unwrappedParams?.id]);

  useEffect(() => {
    if (currentLora) {
      const urls = currentLora?.trainImgs?.map((lora) => lora.imgUrl);
      setTrainUrls(urls);
    }
  }, [currentLora]);

  useEffect(() => {
    setImages(
      trainUrls?.length > 0
        ? trainUrls
        : ["https://r2.nomapos.com/CSC416/loadingImage.svg"]
    );
  }, [trainUrls]);

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // @@@@@@@@@@@@@@@@@@

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
  const discountedPrice = discount?.agreedDiscountRate
    ? productData?.price -
      productData?.price * (discount?.agreedDiscountRate / 100)
    : productData?.price;
  const total = discountedPrice * quantity;

  // Handle quantity changes
  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Truncate description for mobile view
  // const shortDescription = productData?.description
  //   .split("\n")
  //   .slice(0, 4)
  //   .join("\n");
  const shortDescription =
    productData?.description?.split("\n").slice(0, 4).join("\n") ?? "";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{productData?.title}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images - Left Column */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={images[selectedImageIndex] || "/placeholder.svg"}
              alt={`${productData.title} - View ${selectedImageIndex + 1}`}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {images?.map((image, index) => (
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
                      ? productData?.description
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
                  <ReactMarkdown>{productData?.description}</ReactMarkdown>
                </div>
              </div>
            </div>

            <Separator />

            {/* Price Information */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">
                  ${productData.price?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium text-green-600">
                  {discount?.agreedDiscountRate
                    ? discount?.agreedDiscountRate
                    : "0"}
                  % OFF
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

              <Button
                className="w-full bg-blue-500 hover:bg-blue-400"
                size="lg"
              >
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
