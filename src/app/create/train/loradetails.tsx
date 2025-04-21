"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hooks";

import { addCharacterName, addOtherConfig, addTokenName } from "@/redux/slices/trainlora";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LoraConfig {
  caption_dropout_rate: number;
  batch_size: number;
  steps: number;
  optimizer: string;
  lr: number;
  quantize: boolean;
}

export default function LoraDetails() {
  const [config, setConfig] = useState<LoraConfig>({
    caption_dropout_rate: 0.0,
    batch_size: 2,
    steps: 2000,
    optimizer: "adamw",
    lr: 1e-4,
    quantize: true,
  });

  const dispatch = useAppDispatch();

  const handleChange = (
    field: keyof LoraConfig,
    value: string | number | boolean
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    dispatch(addOtherConfig(config))
  };

  const handleCharacterNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(addCharacterName(e.target.value));
  };

  const handleTokenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(addTokenName(e.target.value));
  };

  return (
    <main className="flex items-center justify-center mt-1 p-1">
      {/* CARD */}
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl grid grid-cols-1 z-20">
        {/* Model Name */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="character">Model Name</Label>
          <Input
            type="text"
            id="character"
            placeholder="Model Name"
            onChange={handleCharacterNameChange}
            required={true}
          />
        </div>

        {/* Token */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="token">Trigger Word</Label>
          <Input
            type="text"
            id="token"
            placeholder="Trigger Word"
            onChange={handleTokenNameChange}
          />
        </div>

        {/* Steps */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="steps">Steps</Label>
          <Input
            type="number"
            id="steps"
            placeholder="1"
            min="1"
            value={config.steps}
            onChange={(e) =>
              handleChange("steps", Number.parseInt(e.target.value))
            }
          />
        </div>

        {/* Batch Size */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="batch_size">Batch Size</Label>
          <Input
            type="number"
            id="batch_size"
            placeholder="1"
            min="1"
            value={config.batch_size}
            onChange={(e) =>
              handleChange("batch_size", Number.parseInt(e.target.value))
            }
          />
        </div>

        {/* Learning Rate */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="lr">Learning Rate</Label>
          <Input
            type="number"
            id="lr"
            placeholder="0.0001"
            min="0"
            step="0.0001"
            value={config.lr}
            onChange={(e) =>
              handleChange("lr", Number.parseFloat(e.target.value))
            }
          />
        </div>

        {/* Optimizer (Select) */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="optimizer">Optimizer</Label>
          <Select
            value={config.optimizer}
            onValueChange={(value) => handleChange("optimizer", value)}
          >
            <SelectTrigger id="optimizer">
              <SelectValue placeholder="Select optimizer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adamw">AdamW</SelectItem>
              <SelectItem value="adam">Adam</SelectItem>
              <SelectItem value="sgd">SGD</SelectItem>
              <SelectItem value="adafactor">Adafactor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantize (Boolean) */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="quantize">Quantize</Label>
            <Switch
              id="quantize"
              checked={config.quantize}
              onCheckedChange={(checked) => handleChange("quantize", checked)}
            />
          </div>
        </div>

        {/* Caption Dropout Rate */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="caption_dropout_rate">Caption Dropout Rate</Label>
          <Input
            type="number"
            id="caption_dropout_rate"
            placeholder="0.0"
            min="0"
            max="1"
            step="0.1"
            value={config.caption_dropout_rate}
            onChange={(e) =>
              handleChange(
                "caption_dropout_rate",
                Number.parseFloat(e.target.value)
              )
            }
          />
        </div>
      </div>
    </main>
  );
}
