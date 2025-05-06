"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, X, AlertCircle, Clock } from "lucide-react";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { selectgenerations } from "@/redux/slices/generate";
import { selectProductId } from "@/redux/slices/productId";

// TypeScript interfaces
interface GenerationImage {
  seed: number;
  url: string;
}

interface Generation {
  error: string | null;
  guidance_scale: number;
  height: number;
  width: number;
  images: GenerationImage[];
  lora_scale_requested?: number;
  lora_url?: string;
  negative_prompt: string;
  num_inference_steps: number;
  num_outputs: number;
  prompt: string;
  seed: number;
  task_duration_seconds?: number;
  isProcessing?: boolean; // Added to handle loading state
}

export function GenerationCard({ generation }: { generation: Generation }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isProcessed = generation?.images?.length > 0 ? true : false;
  const hasError = generation.error != null;
  const isLoading = !isProcessed && !hasError;

  return (
    <>
      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-col md:flex-row h-[300px]">
          {/* Left side - Images or Loading State */}
          <div className="w-full md:w-1/2 h-full bg-gray-50 dark:bg-gray-900 relative">
            {isProcessed ? (
              <div
                className={`grid h-full ${
                  generation.images?.length === 1
                    ? "grid-cols-1"
                    : generation.images?.length === 2
                    ? "grid-cols-2"
                    : generation.images?.length === 3
                    ? "grid-cols-2 grid-rows-2"
                    : "grid-cols-2 grid-rows-2"
                } gap-1`}
              >
                {generation.images.map((image, index) => (
                  <div
                    key={image.seed}
                    className={`relative cursor-pointer ${
                      generation.images.length === 3 && index === 0
                        ? "row-span-2"
                        : ""
                    }`}
                    onClick={() => setSelectedImage(image.url)}
                  >
                    <Image
                      src={
                        `https://r2.nomapos.com/${image.url}` ||
                        "/placeholder.svg"
                      }
                      alt={`Generated image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-1 right-1">
                      <Badge variant="secondary" className="text-xs opacity-80">
                        Seed: {image.seed}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">
                  Generating images...
                </p>
                <div className="mt-4 flex flex-col items-center">
                  <Badge variant="outline" className="mb-2">
                    <Clock className="mr-1 h-3 w-3" />
                    {generation.num_outputs} image
                    {generation.num_outputs > 1 ? "s" : ""} requested
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {generation.width}×{generation.height} •{" "}
                    {generation.num_inference_steps} steps
                  </p>
                </div>
              </div>
            ) : hasError ? (
              <div className="flex flex-col items-center justify-center h-full bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-sm text-red-600 dark:text-red-400 text-center px-4">
                  {generation.error}
                </p>
              </div>
            ) : null}
          </div>

          {/* Right side - Details */}
          <CardContent className="w-full md:w-1/2 p-2 flex flex-col overflow-y-auto">
            <div className="mb-2">
              <h3 className="text-lg font-bold line-clamp-2 mb-1">
                {generation.prompt}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {isProcessed ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    Completed
                  </Badge>
                ) : isLoading ? (
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Processing
                  </Badge>
                ) : (
                  <Badge variant="destructive">Failed</Badge>
                )}
                {isProcessed && (
                  <span className="text-xs text-muted-foreground">
                    {generation.task_duration_seconds?.toFixed(1)}s
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
              <div>
                <p className="text-xs text-muted-foreground">Dimensions</p>
                <p className="font-medium">
                  {generation.width}×{generation.height}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Steps</p>
                <p className="font-medium">{generation.num_inference_steps}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guidance Scale</p>
                <p className="font-medium">{generation.guidance_scale}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Images</p>
                <p className="font-medium">{generation.num_outputs}</p>
              </div>
              {generation.lora_scale_requested && (
                <div>
                  <p className="text-xs text-muted-foreground">LoRA Scale</p>
                  <p className="font-medium">
                    {generation.lora_scale_requested}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Seed</p>
                <p className="font-medium">{generation.seed || "Random"}</p>
              </div>
            </div>

            {generation.negative_prompt && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Negative Prompt:
                </p>
                <p className="text-sm mt-1">{generation.negative_prompt}</p>
              </div>
            )}

            {generation.lora_url && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">LoRA:</p>
                <p className="text-xs font-mono truncate mt-1">
                  {generation.lora_url.split("/").pop()}
                </p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Full-screen image dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            {selectedImage && (
              <div className="relative w-[90vw] h-[90vh]">
                <Image
                  src={
                    `https://r2.nomapos.com/${selectedImage}` ||
                    "/placeholder.svg"
                  }
                  alt="Generated image"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function GenerationCards() {
  const generationData = useAppSelector(selectgenerations);
  const productId = useAppSelector(selectProductId);
  const [currentProductGens, setCurrentProductGens] = useState(
    generationData.filter((gen) => gen.productId == productId)
  );

  useEffect(() => {
    if (productId && generationData?.length > 0) {
      setCurrentProductGens(
        generationData.filter((gen) => gen.productId == productId)
      );
    }
  }, [productId, generationData]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {currentProductGens?.length > 0 ?
          currentProductGens?.map((gens) => {
            return gens.generations.map((generation, index) => (
              <GenerationCard key={index} generation={generation} />
            ));
          })
        :
        <div className="bg-slate-100 h-80 w-full text-center flex align-middle justify-center">
          <p className="text-xl font-semibold text-gray-700 mx-auto my-auto">No Product Visuals Generated</p>
        </div>
        }
        {/* {sampleGenerations.map((generation, index) => (
          <GenerationCard key={index} generation={generation} />
        ))} */}
      </div>
    </div>
  );
}
