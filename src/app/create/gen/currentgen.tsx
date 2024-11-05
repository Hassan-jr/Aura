"use client";

import { useState } from "react";
import { ArrowLeftIcon, ChevronDown, ChevronUp } from "lucide-react";
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

export default function CurrentGen({ cancel }) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("");
  const [numImages, setNumImages] = useState(1);
  const [dimension, setDimension] = useState("square");
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [steps, setSteps] = useState(4);
  const [seed, setSeed] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      prompt,
      model,
      numImages,
      dimension,
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
      steps,
      seed,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute h-full top-0 z-50 w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto  p-6 space-y-6 bg-white dark:bg-card rounded-xl shadow-md mb-10 ml-[-4px]"
    >
      <div className="flex flex-row flex-nowrap justify-start align-middle gap-2">
        <Button
          onClick={() => cancel(false)}
          variant="outline"
          className="cursor-pointer bg-transparent shadow-none border-none hover:bg-transparent"
        >
          <ArrowLeftIcon className="h-10 w-10 text-black dark:text-white" />
        </Button>
        <h2 className="text-2xl font-bold text-center mb-6">
          AI Image Generator
        </h2>
      </div>

      <div className="space-y-4">
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
          <Label htmlFor="model">Model</Label>
          <Select value={model} onValueChange={setModel} required>
            <SelectTrigger id="model" className="dark:bg-card">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent className="dark:bg-card dark:text-white">
              <SelectItem value="model1">Model 1</SelectItem>
              <SelectItem value="model2">Model 2</SelectItem>
              <SelectItem value="model3">Model 3</SelectItem>
            </SelectContent>
          </Select>
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

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full justify-between bg-white dark:bg-transparent text-black dark:text-white"
          >
            Advanced Options
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showAdvanced && (
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
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="outline"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white dark:text-white"
      >
        Generate Images
      </Button>
    </form>
  );
}
