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

interface Step {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text1, setText1] = useState<string>(" ");
  const [text2, setText2] = useState<string>("Please DO NOT Close This Window");

  const params = useAppSelector(selectTrainLoraParams);
  const user = false;
  const user_id_test = "123456789"

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

  const handleNext = () => {
    //  check character Details
    if (currentStep == 1) {
      if (
        !params.characterName ||
        params.characterName === undefined ||
        !params.characterName.trim()
      ) {
        toast({
          variant: "destructive",
          title: "Please Provide Character Name",
          description: `Add a Unique Character Name to Continue`,
        });
        return;
      }
      if (!params.token || params.token === undefined || !params.token.trim()) {
        toast({
          variant: "destructive",
          title: "Please Provide Token Name (Triger Word)",
          description: `Add a Unique Token Name to Continue`,
        });
        return;
      }
      if (
        !params.gender ||
        params.gender === undefined ||
        !params.gender.trim()
      ) {
        toast({
          variant: "destructive",
          title: "Please Select Gender Type",
          description: `Select Gender Type to Continue`,
        });
        return;
      }
    }

    // check image upload
    if (currentStep == 2) {
      // close up
      if (params.closeUp.length < 12) {
        toast({
          variant: "destructive",
          title: "You Need More Close-Up Photos",
          description: `Add ${
            12 - params.closeUp.length
          } More Close-Up Photos to Continue`,
        });
        return;
      }

      if (params.closeUp.length > 12) {
        toast({
          variant: "destructive",
          title: "You Only Need 12 Close-Up Photos",
          description: `Remove ${
            params.closeUp.length - 12
          } Close-Up Photos  to Continue`,
        });
        return;
      }

      // half body shots up
      if (params.halfbody.length < 5) {
        toast({
          variant: "destructive",
          title: "You Need More Half-Body Shot Photos",
          description: `Add ${
            5 - params.halfbody.length
          } More Half-Body Shot Photos to Continue`,
        });
        return;
      }

      if (params.halfbody.length > 5) {
        toast({
          variant: "destructive",
          title: "You Only Need 5 Half-Body Shot Photos",
          description: `Remove ${
            params.halfbody.length - 5
          } Half-Body Shot Photos  to Continue`,
        });
        return;
      }

      // full body shots
      if (params.fullbody.length < 3) {
        toast({
          variant: "destructive",
          title: "You Need More Full-Body Shot Photos",
          description: `Add ${
            3 - params.fullbody.length
          } More Full-Body Shot Photos to Continue`,
        });
        return;
      }

      if (params.fullbody.length > 3) {
        toast({
          variant: "destructive",
          title: "You Only Need 3 Full-Body Shot Photos",
          description: `Remove ${
            params.fullbody.length - 3
          } Full-Body Shot Photos  to Continue`,
        });
        return;
      }
    }

    // proceed
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    // ensure user is logged in

    if (user) {
      toast({
        variant: "destructive",
        title: "Unable To Authenticate",
        description: `Please Make Sure You are Logged In`,
      });
      setIsLoading(false);
      return;
    }

    // start
    try {
      const allUrls = [
        ...params.closeUp,
        ...params.halfbody,
        ...params.fullbody,
      ];
      setText1("Uploading Images...");
      // upload images
      const imageUrls = await uploadImages(
        allUrls,
        user_id_test, //user?.publicMetadata?.userId as string,
        params.characterName
      );

      setText2("Almost Done Uploading...");
      // save lora
      const mongoDbId = await storeLoraData({
        userId: user_id_test, //user?.publicMetadata?.userId as string,
        characterName: params.characterName,
        tokenName: params.token,
        gender: params.gender,
        trainImgs: imageUrls,
      });

      setText2("Processing Images...");
      // caption
      const captions = await sendToChatGPT(imageUrls);
      setText2("Almost Done...");

      // update lora
      const result = await updateLoraCaptions(mongoDbId, captions);
      setText2("Done...");

      if (result) {
        toast({
          title: "Training Your AI Character Started",
          description: `We will notify you when its done training`,
        });
      }

      // Show success message or redirect
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
    <form action="#" className="w-full overflow-x-hidden mb-10" method="post">
      <Card className="rounded-none border-0 mt-2 bg-transparent" data-stepper="true">
        <div className="">

          {/* step content */}
          <div className="gap-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={index === currentStep ? "mb-2" : "hidden mb-2"}
                id={`stepper_${index + 1}`}
              >
                {step.content}
              </div>
            ))}
          </div>

          {/* step footer (buttons) */}
          <div className="py-8 flex justify-between">
            <div>
              <Button
                type="button"
                className={`btn btn-light bg-black text-white ${currentStep === 0 ? "hidden" : ""}`}
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
            <div>
              {currentStep < steps.length - 1 ? (
                <Button type="button" className="z-50 bg-black text-white" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  className="btn btn-primary bg-gradient-to-r from-indigo-500 to-purple-500 w-full"
                  onClick={handleSubmit}
                >
                  Start Training
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
      {isLoading && (
        <div>
          <SkeletonSpinner text1={text1} text2={text2} />
        </div>
      )}
    </form>
  );
};

export default Stepper;
