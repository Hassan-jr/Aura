"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { useAppSelector } from "@/redux/hooks";
import { selectloras } from "@/redux/slices/lora";

interface ProductCardProps {
  _id: string;
  title: string;
  price: number;
  description: string;
}

export default function ProductCard({
  title,
  price,
  description,
  _id,
}: ProductCardProps) {
  const lorasData = useAppSelector(selectloras);
  const [currentLora, setCurrentLora] = useState(
    lorasData.find((lora) => lora.productId == _id)
  );

  useEffect(() => {
    if (_id && lorasData) {
      const lora = lorasData.find((lora) => lora.productId == _id);
      setCurrentLora(lora);
    }
  }, [lorasData, _id]);

  const [trainUrls, setTrainUrls] = useState([]);
  useEffect(() => {
    if (currentLora) {
      const urls = currentLora?.trainImgs?.map((lora) => lora.imgUrl);
      setTrainUrls(urls);
    }
  }, [currentLora]);

  // https://r2.nomapos.com/CSC416/loadingImage.svg
  const [images, setImages] = useState(
    trainUrls?.length > 0
      ? trainUrls
      : ["https://r2.nomapos.com/CSC416/loadingImage.svg"]
  );

  useEffect(() => {
    setImages(
      trainUrls?.length > 0
        ? trainUrls
        : ["https://r2.nomapos.com/CSC416/loadingImage.svg"]
    );
  }, [trainUrls]);

  const [mainImage, setMainImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const truncatedDescription = description.slice(0, 100);

  return (
    <Card className="w-80 h-auto">
      <CardContent className="p-0">
        <div className="relative w-80 h-80">
          <Image
            src={images[mainImage]}
            alt={`${title} - Image ${mainImage + 1}`}
            fill
            className="object-cover w-80 h-80"
          />
        </div>
        <div className="flex justify-between p-2">
          <div className="flex space-x-1 overflow-y-auto whitespace-nowrap">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(index)}
                className={`w-16 h-16 relative ${
                  index === mainImage ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{title}</h2>
            <span className="text-lg font-semibold">${price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600">
            {showFullDescription ? (
              <ReactMarkdown>{description}</ReactMarkdown>
            ) : (
              <ReactMarkdown>{truncatedDescription}</ReactMarkdown>
            )}

            {!showFullDescription && description.length > 100 && (
              <button
                onClick={() => setShowFullDescription(true)}
                className="text-primary hover:underline ml-1"
              >
                ... see more
              </button>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
