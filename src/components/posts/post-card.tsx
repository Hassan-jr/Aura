"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitFeedback } from "@/actions/feedback.actions";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import runpodSdk from "runpod-sdk";

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  hashtags: string;
  images: string[];
  //   userId: string;
}

const formSchema = z.object({
  feedback: z.string().min(1, "Feedback is required"),
  rating: z.number().min(1).max(5),
});

export default function PostCard({
  id,
  title,
  description,
  images,
  hashtags,
}: PostCardProps) {
  const [mainImage, setMainImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: session } = useSession();

  const truncatedDescription = description.slice(0, 100);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
      rating: 0,
    },
  });

  const runpod = runpodSdk(process.env.NEXT_PUBLIC_RUNPOD_API_KEY);
  const endpoint = runpod.endpoint(process.env.NEXT_PUBLIC_SENTIMENT_ENDPOINT_ID);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const savedFeedback = await submitFeedback({
      feedback: values.feedback,
      productId: id,
      rating: values.rating,
      userId: session.user.id,
      polarity: [],
      emotion: [],
    });
    setDialogOpen(false);
    form.reset();
    console.log("savedFeedback id:", savedFeedback);
    // send to sentiment analysis
    const result = await endpoint.run({
      input: {
        sentiments: [values.feedback],
      },
      webhook: `https://inprimeai.vercel.app/api/webhooks/feedback/${savedFeedback.id}`,
      policy: {
        executionTimeout: 1000 * 60 * 3,
      },
    });
    console.log(result);
    toast({
      variant: "default",
      title: "Feedback Submitted Successful",
      description: "",
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        <div className="relative flex flex-row">
          <div className="flex flex-col space-y-2 z-50">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(index)}
                className={`w-16 h-16 relative ${
                  index === mainImage ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={`https://r2.nomapos.com/${img}`}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <div className="aspect-square">
            <Image
              src={`https://r2.nomapos.com/${images[mainImage]}`}
              alt={`${title} - Image ${mainImage + 1}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <p className="text-sm text-gray-600">
            {showFullDescription ? description : truncatedDescription}
            {!showFullDescription && description.length > 100 && (
              <button
                onClick={() => setShowFullDescription(true)}
                className="text-blue-500 hover:underline ml-1"
              >
                ... see more
              </button>
            )}
          </p>
          <p className="text-sm text-blue-600 mt-1">{hashtags}</p>
          <div className="flex justify-start space-x-4 mt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "bg-blue-100" : ""}
            >
              <Heart className={isLiked ? "fill-blue-500 text-blue-500" : ""} />
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MessageCircle />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Give Feedback</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="feedback"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your feedback"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <FormControl>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Button
                                  key={star}
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => field.onChange(star)}
                                >
                                  <Star
                                    className={
                                      star <= field.value
                                        ? "fill-yellow-400 text-yellow-400 text-lg"
                                        : ""
                                    }
                                  />
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-black text-white"
                    >
                      Submit Feedback
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShared(!isShared)}
              className={isShared ? "bg-blue-100" : ""}
            >
              <Share2
                className={isShared ? "fill-blue-500 text-blue-500" : ""}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
