"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface ProductCardProps {
  title: string;
  price: number;
  description: string;
  images: string[];
}

export default function ProductCard({
  title,
  price,
  description,
}: ProductCardProps) {
  const images = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNob2VzfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNob2VzfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1570464197285-9949814674a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHNob2VzfGVufDB8fDB8fHww",
  ];
  const [mainImage, setMainImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const nextImage = () => setMainImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setMainImage((prev) => (prev - 1 + images.length) % images.length);

  const truncatedDescription = description.slice(0, 100);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={images[mainImage]}
            alt={`${title} - Image ${mainImage + 1}`}
            fill
            // width={50}
            // height={50}
            className="object-cover"
          />
        </div>
        <div className="flex justify-between p-2">
          <div className="flex space-x-2">
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
