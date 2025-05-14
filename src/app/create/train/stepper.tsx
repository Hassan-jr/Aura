"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAppSelector } from "@/redux/hooks";

import { selectTrainLoraParams } from "@/redux/slices/trainlora";
import { uploadImages } from "@/actions/uploadImages.action";
import { storeLoraData, updateLoraCaptions } from "@/actions/lora.action";
import { sendToChatGPT } from "@/actions/caption.action";

import { SkeletonSpinner } from "@/customui/skeletonspinner";
import { useSession } from "next-auth/react";
import { selectProductId } from "@/redux/slices/productId";
import runpodSdk from "runpod-sdk";

const Stepper = ({ setOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text1, setText1] = useState<string>(" ");
  const [text2, setText2] = useState<string>("Please DO NOT Close This Window");

  const params = useAppSelector(selectTrainLoraParams);
  const { data: session } = useSession();
  const user_id = session.user.id;
  const productId = useAppSelector(selectProductId);

  useEffect(() => {
    // Clean up function to revoke object URLs
    return () => {
      [...params.closeUp, ...params.halfbody, ...params.fullbody].forEach(
        (url) => {
          URL.revokeObjectURL(url);
        }
      );
    };
  }, [params.closeUp, params.halfbody, params.fullbody]);

  const runpod = runpodSdk(process.env.NEXT_PUBLIC_RUNPOD_VISION_API_KEY);
  const endpoint = runpod.endpoint(process.env.NEXT_PUBLIC_LORA_ENDPOINT_ID);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    // ensure user is logged in

    if (!user_id) {
      toast({
        variant: "destructive",
        title: "Unable To Authenticate",
        description: `Please Make Sure You are Logged In`,
      });
      setIsLoading(false);
      return;
    }

    if (!params.token) {
      toast({
        variant: "destructive",
        title: "Trigger Word is Required",
        description: `Please Provide a Trigger Word for Training`,
      });
      setIsLoading(false);
      return;
    }

    // if token already exits ignore

    // start
    try {
      const allUrls = [...params.closeUp];

      setText1("Uploading Images...");
      // upload images
      const imageUrls = await uploadImages(allUrls, user_id, params.token);

      setText2("Saving Your Request...");

      // save lora
      const mongoDbId = await storeLoraData({
        userId: user_id, //user?.publicMetadata?.userId as string,
        characterName: params.characterName,
        tokenName: params.token,
        gender: params.gender,
        trainImgs: imageUrls,
        productId: productId,
        caption_dropout_rate: params.caption_dropout_rate,
        batch_size: params.batch_size,
        steps: params.steps,
        optimizer: params.optimizer,
        lr: params.lr,
        quantize: params.quantize,
        loraPath: `https://r2.nomapos.com/${process.env.NEXT_PUBLIC_R2_VISION_PATH_IN_BUCKET}/${user_id}/${params.token}.safetensors`,
        status: "Training",
      });

      setText2("Processing Your Request...");
      const result = await endpoint.run({
        input: {
        image_urls: imageUrls,
        trigger_word:  params.token,
        model_id: user_id,
        caption_dropout_rate: params.caption_dropout_rate,
        batch_size: params.batch_size,
        steps: params.steps,
        optimizer: params.optimizer,
        lr:  params.lr,
        quantize: params.quantize,
        r2_bucket_name: process.env.NEXT_PUBLIC_R2_VISION_BUCKET_NAME,
        r2_access_key_id: process.env.NEXT_PUBLIC_R2_VISION_ACCESS_KEY_ID,
        r2_secret_access_key: process.env.NEXT_PUBLIC_R2_VISION_SECRET_ACCESS_KEY,
        r2_endpoint_url: process.env.NEXT_PUBLIC_R2_VISION_ENDPOINT_URL,
        r2_path_in_bucket: process.env.NEXT_PUBLIC_R2_VISION_PATH_IN_BUCKET,
        },
        webhook: `https://inprimeai.vercel.app/api/webhooks/lora/${mongoDbId}`,
        policy: {
          executionTimeout: 1000 * 60 * 60 * 3,
        },
      });
      console.log(result);

      if (result) {
        toast({
          title: "Training Your AI Product Started",
          description: `We will notify you when its done training`,
        });
      }
      setOpen(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError(
        "An error occurred while processing your request. Please try again."
      );
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: `n error occurred while processing your request. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="button"
        className="btn btn-primary bg-gradient-to-r from-indigo-500 to-purple-500 w-full"
        onClick={handleSubmit}
      >
        Start Training
      </Button>
      {isLoading && (
        <div>
          <SkeletonSpinner text1={text1} text2={text2} />
        </div>
      )}
    </div>
  );
};

export default Stepper;
