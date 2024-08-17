"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function TrainImgUpload() {
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [closeUp, setCloseUp] = useState<File[]>([]);
  const [halfbody, setHalfbody] = useState<File[]>([]);
  const [fullbody, setFullbody] = useState<File[]>([]);

  const handleCloseUpFileUpload = (uploadedfiles: File[]) => {
    setCloseUp(uploadedfiles);
  };

  const handleHalfbodyFileUpload = (uploadedfiles: File[]) => {
    setHalfbody(uploadedfiles);
  };

  const handleFullbodyFileUpload = (uploadedfiles: File[]) => {
    setFullbody(uploadedfiles);
  };

  const uploadImgs = () => {
    if (closeUp.length < 12) {
      toast({
        variant: "destructive",
        title: "You Need 12 Close-Up Photoes",
        description: `Add ${12 - closeUp.length} More Photoes`,
      });
    }
    if (closeUp.length > 12) {
      toast({
        variant: "destructive",
        title: "You Only Need 12 Close-Up Photoes",
        description: `Remove ${closeUp.length - 12} Close-up Photoes`,
      });
    }
  };

  return (
    <div>
      {/* CARD */}
      <Card className=" w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl flex flex-col items-start justify-center z-20">
        {/* character name */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="character">Character Name</Label>
          <Input type="text" id="character" placeholder="Character Name" />
        </div>
        {/* character gender */}
        <div className="w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="">Gender</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Character Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel className="dark:text-white font-semibold">Gender</SelectLabel> */}
                <SelectItem
                  className="dark:text-white font-semibold"
                  value="Male"
                >
                  Male
                </SelectItem>
                <SelectItem
                  className="dark:text-white font-semibold"
                  value="Female"
                >
                  Female
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* token */}
        <div className="grid w-full max-w-sm items-center gap-1.5 m-1">
          <Label htmlFor="token">Token</Label>
          <Input type="text" id="token" placeholder="Token" />
        </div>
      </Card>
      {/* Close up */}
      <Card className="rounded-lg p-1 my-1">
        <div className="w-full flex flex-row justify-between">
          <p className="text-lg font-bold">Close-up Photos</p>
          <p className="font-bold">{closeUp.length}/12</p>
        </div>
        <FileUpload onChange={handleCloseUpFileUpload} />
      </Card>

      {/* half body shots */}
      <Card className="p-1 rounded-lg my-1">
        <div className="w-full flex flex-row justify-between">
          <p className="text-lg font-bold">Half-body Shot Photos</p>
          <p className="font-bold">{halfbody.length}/5</p>
        </div>
        <FileUpload onChange={handleHalfbodyFileUpload} />
      </Card>

      {/* full body shot */}
      <Card className="my-1 p-1">
        <div className="w-full flex flex-row justify-between">
          <p className="text-lg font-bold">Full-body Shot Photos</p>
          <p className="font-bold">{fullbody.length}/3</p>
        </div>
        <FileUpload onChange={handleFullbodyFileUpload} />
      </Card>

      {/* button */}
      <Button className="z-1000" onClick={uploadImgs}>
        Upload
      </Button>
    </div>
  );
}
