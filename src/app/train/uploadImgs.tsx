"use client";
import React, { useEffect, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Card } from "@/components/ui/card";
import { useAppDispatch } from "@/redux/hooks";
import {
  addCloseUpPhotoes,
  addHalfbodyPhotoes,
  addFullbodyPhotoes,
} from "@/redux/slices/trainlora";

export default function TrainImgUpload() {
  const dispatch = useAppDispatch();

  const [closeUp, setCloseUp] = useState<File[]>([]);
  const [halfbody, setHalfbody] = useState<File[]>([]);
  const [fullbody, setFullbody] = useState<File[]>([]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCloseUpFileUpload = async (uploadedfiles: File[]) => {
    setCloseUp(uploadedfiles);
    const metadata = await Promise.all(
      closeUp.map((file) => fileToBase64(file))
    );
    dispatch(addCloseUpPhotoes(metadata));
  };

  const handleHalfbodyFileUpload = async (uploadedfiles: File[]) => {
    setHalfbody(uploadedfiles);
    const metadata = await Promise.all(
      halfbody.map((file) => fileToBase64(file))
    );
    dispatch(addHalfbodyPhotoes(metadata));
  };

  const handleFullbodyFileUpload = async (uploadedfiles: File[]) => {
    setFullbody(uploadedfiles);
    const metadata = await Promise.all(
      fullbody.map((file) => fileToBase64(file))
    );
    dispatch(addFullbodyPhotoes(metadata));
  };

  return (
    <div>
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
    </div>
  );
}
