"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <Card>
      {/* Close up */}
      <div className="rounded-lg p-1">
        <div className="w-full flex flex-row justify-between">
          <p className="text-lg font-bold">1. Close-up Photos</p>
          <p className="font-bold">{closeUp.length}/12</p>
        </div>
        <FileUpload onChange={handleCloseUpFileUpload} />
      </div>

      {/* half body shots */}
      <div className="mt-1 p-1 rounded-lg">
        <div className="w-full flex flex-row justify-between">
          <p className="text-lg font-bold">2. Half-body Shot Photos</p>
          <p className="font-bold">{halfbody.length}/5</p>
        </div>
        <FileUpload onChange={handleHalfbodyFileUpload} />
      </div>

      {/* full body shot */}
      <div className="mt-1 p-1">
        <div className="w-full flex flex-row justify-between">
          <p className="text-lg font-bold">3. Full-body Shot Photos</p>
          <p className="font-bold">{fullbody.length}/3</p>
        </div>
        <FileUpload onChange={handleFullbodyFileUpload} />
      </div>

      {/* button */}
      <Button className="z-1000" onClick={uploadImgs}>Upload</Button>
    </Card>
  );
}
