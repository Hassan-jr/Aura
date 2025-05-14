"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { selectloras } from "@/redux/slices/lora";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { Button } from "../ui/button";

interface Lora {
  _id: string;
  userId: string;
  characterName: string;
  tokenName: string;
  gender: string;
  productId: string;
  caption_dropout_rate: number;
  batch_size: number;
  steps: number;
  optimizer: string;
  lr: number;
  quantize: boolean;
  loraPath: string;
  status: string;
  trainImgs: {
    imgUrl: string;
  }[];
  captions: {
    caption: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const ImageCarousel = ({ images }: { images: { imgUrl: string }[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full overflow-hidden rounded-l-lg">
        <Image
          src={images[currentIndex].imgUrl || "/placeholder.svg"}
          alt={`Training image ${currentIndex + 1}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "Training":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Training
        </Badge>
      );
    case "success":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    case "Pending":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const LoraCard = ({ lora }: { lora: Lora }) => {
  const formattedDate = new Date(lora.createdAt).toLocaleTimeString();

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="flex h-[300px]">
        <div className="w-1/3 h-full">
          <ImageCarousel images={lora.trainImgs} />
        </div>
        <CardContent className="w-2/3 p-5 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{lora.characterName}</h3>
            <StatusBadge status={lora.status} />
          </div>

          <p className="text-sm text-muted-foreground mb-1">
            Token: <span className="font-mono">{lora.tokenName}</span>
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <div>
              <p className="text-xs text-muted-foreground">Batch Size</p>
              <p className="font-medium">{lora.batch_size}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Steps</p>
              <p className="font-medium">{lora.steps}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Optimizer</p>
              <p className="font-medium">{lora.optimizer}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Learning Rate</p>
              <p className="font-medium">{lora.lr}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dropout Rate</p>
              <p className="font-medium">{lora.caption_dropout_rate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quantize</p>
              <p className="font-medium">{lora.quantize ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="mt-auto flex flex-row justify-between">
          <p className="text-xs text-muted-foreground mt-2">
              Last updated: {lora.createdAt}
            </p>
            <Link href={`/dashboard/model/${lora._id}`} className="right">
              <Button className="bg-blue-600 hover:bg-blue-500 w-28">View Model</Button>
            </Link>
            
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default function LoraCards() {
  const lorasData = useAppSelector(selectloras);
  const trainingLoras = lorasData.filter((lora) => lora.status === "Training");
  const otherLoras = lorasData.filter((lora) => lora.status !== "Training");

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All ({lorasData.length})</TabsTrigger>
        <TabsTrigger value="training">
          Training ({trainingLoras.length})
        </TabsTrigger>
        <TabsTrigger value="other">Completed ({otherLoras.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="training" className="space-y-4">
        {trainingLoras.length > 0 ? (
          trainingLoras.map((lora) => <LoraCard key={lora._id} lora={lora} />)
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No training loras found.
          </p>
        )}
      </TabsContent>

      <TabsContent value="other" className="space-y-4">
        {otherLoras.length > 0 ? (
          otherLoras.map((lora) => <LoraCard key={lora._id} lora={lora} />)
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No other loras found.
          </p>
        )}
      </TabsContent>

      <TabsContent value="all" className="space-y-4">
        {lorasData.map((lora) => (
          <LoraCard key={lora._id} lora={lora} />
        ))}
      </TabsContent>
    </Tabs>
  );
}
