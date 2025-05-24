// import React, { useEffect, useState } from "react";
// import { cn } from "@/lib/utils";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Message } from "./types";
// import { useAppSelector } from "@/redux/hooks";
// import { selectgenerations } from "@/redux/slices/generate";
// import { AlertCircle, Clock, Loader2, X } from "lucide-react";
// import Image from "next/image";
// import { Badge } from "../ui/badge";
// import { Dialog, DialogContent } from "../ui/dialog";


// interface Generation {
//   error: string | null;
//   prompt: string;
//   negative_prompt: string;
//   width: number;
//   height: number;
//   guidance_scale: number;
//   num_inference_steps: number;
//   seed: number;
//   lora_url: string;
//   lora_scale_requested: number;
//   task_duration_seconds: number;
//   images?: string[];      // or whatever type your images array is
// }

// export function MessageImageBubble({ message }) {
//   const isUser = message.role === "user";
//   const generationData = useAppSelector(selectgenerations);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const [generation, setGeneration] = useState<Generation | null>(
//     (generationData.find((gen) => gen._id == message?.generationId)?.generations)  as unknown as Generation
//   );

//   const [isProcessed, setisProcessed] = useState(true);
//   const [hasError, sethasError] = useState(false);
//   const [isLoading, setisLoading] = useState(false);

//   useEffect(() => {
//     const gen = (generationData.find(
//       (gen) => gen._id == message?.generationId
//     )?.generations)  as unknown as Generation;
//     setGeneration(gen);
//     setisProcessed(gen.images?.length > 0 ? true : false);
//     sethasError(gen.error != null);
//   }, [generationData, message]);

//   useEffect(() => {
//     setisLoading(!isProcessed && !hasError);
//   }, [isProcessed, hasError]);

//   console.log("Generation:", generation);
//   console.log("isProcessed:", isProcessed);
//   console.log("hasError:", hasError);
//   console.log("isLoading:", isLoading);

//   return (
//     <div
//       className={cn(
//         "flex items-end mb-4",
//         isUser ? "justify-end" : "justify-start"
//       )}
//     >
//       <div
//         className={cn(
//           "flex items-end w-full",
//           isUser ? "flex-row-reverse" : "flex-row"
//         )}
//       >
//         <Avatar className="w-8 h-8">
//           <AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
//         </Avatar>
//         {/* image here */}
//         <div className="w-full md:w-1/2 h-full bg-gray-50 dark:bg-gray-900 relative">
//           {isProcessed ? (
//             <div
//               className={`grid h-full ${
//                 generation?.images?.length === 1
//                   ? "grid-cols-1"
//                   : generation?.images?.length === 2
//                   ? "grid-cols-2"
//                   : generation?.images?.length === 3
//                   ? "grid-cols-2 grid-rows-2"
//                   : "grid-cols-2 grid-rows-2"
//               } gap-1`}
//             >
//               {generation.images?.map((image, index) => (
//                 <div
//                   key={image?.seed}
//                   className={`relative cursor-pointer ${
//                     generation?.images.length === 3 && index === 0
//                       ? "row-span-2"
//                       : ""
//                   }`}
//                   onClick={() => setSelectedImage(image?.url)}
//                 >
//                   <Image
//                     src={
//                       `https://r2.nomapos.com/${image?.url}` ||
//                       "/placeholder.svg"
//                     }
//                     alt={`Generated image ${index + 1}`}
//                     fill
//                     className="object-cover"
//                   />
//                   <div className="absolute bottom-1 right-1">
//                     <Badge variant="secondary" className="text-xs opacity-80">
//                       Seed: {image?.seed}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : isLoading ? (
//             <div className="flex flex-col items-center justify-center h-full">
//               <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
//               <p className="text-sm text-muted-foreground">
//                 Generating images...
//               </p>
//               <div className="mt-4 flex flex-col items-center">
//                 <Badge variant="outline" className="mb-2">
//                   <Clock className="mr-1 h-3 w-3" />
//                   {generation?.num_outputs} image
//                   {generation?.num_outputs > 1 ? "s" : ""} requested
//                 </Badge>
//                 <p className="text-xs text-muted-foreground">
//                   {generation?.width}×{generation?.height} •{" "}
//                   {generation?.num_inference_steps} steps
//                 </p>
//               </div>
//             </div>
//           ) : hasError ? (
//             <div className="flex flex-col items-center justify-center h-full bg-red-50 dark:bg-red-900/20">
//               <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
//               <p className="text-sm text-red-600 dark:text-red-400 text-center px-4">
//                 {generation?.error}
//               </p>
//             </div>
//           ) : null}
//         </div>

//         {/* full image */}
//         <Dialog
//           open={!!selectedImage}
//           onOpenChange={() => setSelectedImage(null)}
//         >
//           <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <button
//                 onClick={() => setSelectedImage(null)}
//                 className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
//                 aria-label="Close"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//               {selectedImage && (
//                 <div className="relative w-[90vw] h-[90vh]">
//                   <Image
//                     src={
//                       `https://r2.nomapos.com/${selectedImage}` ||
//                       "/placeholder.svg"
//                     }
//                     alt="Generated image"
//                     fill
//                     className="object-contain"
//                     priority
//                   />
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }

// export function LoadingBubble() {
//   return (
//     <div className="flex items-end mb-4 justify-start">
//       <div className="flex items-end max-w-[80%] flex-row">
//         <Avatar className="w-8 h-8">
//           <AvatarFallback>AI</AvatarFallback>
//         </Avatar>
//         <div className="mx-2 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse">
//           <span className="inline-flex gap-1">
//             <span className="animate-bounce">.</span>
//             <span className="animate-bounce animation-delay-200">.</span>
//             <span className="animate-bounce animation-delay-400">.</span>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/redux/hooks";
import { selectgenerations } from "@/redux/slices/generate";
import { AlertCircle, Clock, Loader2, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent } from "../ui/dialog";

// Flattened image type
interface GenImage {
  seed: number;
  url: string;
}

export function MessageImageBubble({ message }) {
  const isUser = message.role === "user";
  const generationGroups = useAppSelector(selectgenerations);

  const [images, setImages] = useState<GenImage[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Find the group matching this message
    const group = generationGroups.find(g => g._id === message.generationId);
    if (group && Array.isArray(group.generations)) {
      // Merge all images from each generation task
      const flat = group.generations.reduce<GenImage[]>((acc, gen) => {
        if (gen.images) {
          return acc.concat(gen.images);
        }
        return acc;
      }, []);
      setImages(flat);
      setIsProcessed(flat.length > 0);
      // consider errors across tasks
      setHasError(group.generations.some(gen => !!gen.error));
    } else {
      setImages([]);
      setIsProcessed(false);
      setHasError(false);
    }
  }, [generationGroups, message.generationId]);

  useEffect(() => {
    setIsLoading(!isProcessed && !hasError);
  }, [isProcessed, hasError]);

  return (
    <div className={cn("flex items-end mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex items-end w-full", isUser ? "flex-row-reverse" : "flex-row")}>
        <Avatar className="w-8 h-8">
          <AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
        </Avatar>

        <div className="w-full md:w-1/2 h-full bg-gray-50 dark:bg-gray-900 relative">
          {isProcessed ? (
            <div
              className={`grid h-48 grid-cols-${Math.min(images.length, 2)} gap-1`}>
              {images.map((image, idx) => (
                <div
                  key={image.seed + idx}
                  className="relative cursor-pointer"
                  onClick={() => setSelectedImage(image.url)}
                >
                  <Image
                    src={`https://r2.nomapos.com/${image.url}`}
                    alt={`Generated image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Generating images...</p>
              <div className="mt-4 flex flex-col items-center">
                <Badge variant="outline" className="mb-2">
                  <Clock className="mr-1 h-3 w-3" />
                  {generationGroups.find(g => g._id === message.generationId)?.generations.length} task(s)
                </Badge>
              </div>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center h-full bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-sm text-red-600 dark:text-red-400 text-center px-4">
                Error generating images
              </p>
            </div>
          ) : null}
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
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
                    src={`https://r2.nomapos.com/${selectedImage}`}
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
      </div>
    </div>
  );
}
