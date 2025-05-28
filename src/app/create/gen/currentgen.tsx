"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";
import { selectloras } from "@/redux/slices/lora";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { SkeletonSpinner } from "@/customui/skeletonspinner";
import { toast } from "@/components/ui/use-toast";
import GenerateVisuals from "@/actions/generate.actions";
import { Switch } from "@/components/ui/switch";

export default function CurrentGen({ cancel }) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [dimension, setDimension] = useState("square");
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [scale, setScale] = useState(4);
  const [seed, setSeed] = useState(0);
  const [isVideo, setIsVideo] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text1, setText1] = useState<string>(" ");
  const [text2, setText2] = useState<string>("Please DO NOT Close This Window");

  const [selectedLora, setSelectedLora] = useState<any>({});

  const lorasData = useAppSelector(selectloras);

  const { data: session } = useSession();
  const user_id = session.user.id;

  useEffect(() => {
    const selectedOne = lorasData.find((lora) => lora.loraPath == model);
    setSelectedLora(selectedOne);
  }, [model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user_id;
    const lora_url = model;
    const lora_scale = 0.9;
    const productId = selectedLora.productId;

    const generations = [];
    const data = {
      prompt,
      negative_prompt: "",
      num_outputs: numImages,
      width:
        dimension === "custom"
          ? customWidth
          : dimension === "square"
          ? 1024
          : dimension === "portrait"
          ? 1080
          : 1920,
      height:
        dimension === "custom"
          ? customHeight
          : dimension === "square"
          ? 1024
          : dimension === "portrait"
          ? 1920
          : 1080,
      num_inference_steps: steps,
      guidance_scale: scale,
      seed: seed == 0 ? null : seed,
    };

    generations.push(data);
    console.log(generations);
    setIsLoading(true);
    try {
      setText1("Submitting Your Request....");
      const result = await GenerateVisuals({
        userId,
        lora_url,
        lora_scale,
        productId,
        isVideo,
        generations,
      });

      console.log(result);

      if (result.result) {
        toast({
          title: "Generation Has Started",
          description: `We will notify you when its done`,
        });
      }
      setIsLoading(false);
      cancel(false);
    } catch (error) {
      console.log("Error:", error);
      toast({
        title: "An Error Occured",
        description: `An error occured while generating`,
      });
      setIsLoading(false);
      cancel(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative h-full top-0 z-50 w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto  p-6 space-y-6 bg-white dark:bg-card rounded-xl shadow-md mb-10 ml-[-4px]"
    >
      <div className="flex flex-row flex-nowrap justify-between align-middle gap-2">
        <h2 className="text-2xl font-bold text-center mb-6">Create</h2>
        <Button
          onClick={() => cancel(false)}
          variant="outline"
          className="cursor-pointer bg-red-600 text-white shadow-none border-none hover:bg-red-400"
        >
          {/* <X className="h-20 w-20 text-red-600 dark:text-white" /> */}
          close
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={setModel} required>
            <SelectTrigger id="model" className="dark:bg-card">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent className="dark:bg-card dark:text-white">
              {lorasData?.length > 0 &&
                lorasData.map((lora, idx) => (
                  <SelectItem key={idx} value={lora.loraPath}>
                    {lora.characterName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* TOKEN AND PHRAE model */}
        {selectedLora && (
          <p className="text-sm text-muted-foreground mb-1">
            Token: <span className="font-mono">{selectedLora?.tokenName}</span>
          </p>
        )}
        {selectedLora && (
          <p className="text-sm text-muted-foreground mb-1">
            Pharase:{" "}
            <span className="font-mono">
              {selectedLora?.tokenName}, a photo of {selectedLora?.tokenName}
            </span>
          </p>
        )}

        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            // row={4}
            placeholder="Enter your image description (Prompt)"
            className="dark:bg-card"
          />
        </div>

        <div>
          <Label htmlFor="numImages">Number of Images</Label>
          <Input
            id="numImages"
            type="number"
            value={numImages}
            onChange={(e) => setNumImages(Number(e.target.value))}
            min={1}
          />
        </div>

        <div>
          <Label htmlFor="dimension">Image Dimension</Label>
          <Select value={dimension} onValueChange={setDimension}>
            <SelectTrigger id="dimension" className="dark:bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-card dark:text-white">
              <SelectItem value="square">Square (1024x1024)</SelectItem>
              <SelectItem value="portrait">Portrait (1080x1920)</SelectItem>
              <SelectItem value="landscape">Landscape (1920x1080)</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {dimension === "custom" && (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="customWidth">Width</Label>
              <Input
                id="customWidth"
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="customHeight">Height</Label>
              <Input
                id="customHeight"
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>
        )}

        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="steps">Number of Steps</Label>
            <Input
              id="steps"
              type="number"
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              min={1}
            />
          </div>

          <div>
            <Label htmlFor="steps">Guidance Scale</Label>
            <Input
              id="guidance_scale"
              type="number"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <Label htmlFor="seed">Seed</Label>
            <Input
              id="seed"
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              min={0}
            />
          </div>
          <div>
            <Label htmlFor="isVideo">Generate As a Video</Label>

            <Switch
              id="isVideo"
              checked={isVideo}
              onCheckedChange={() => setIsVideo(!isVideo)}
              className="bg-blue-600"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="outline"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white"
      >
        Generate Images
      </Button>

      {isLoading && (
        <div>
          <SkeletonSpinner text1={text1} text2={text2} />
        </div>
      )}
    </form>
  );
}
