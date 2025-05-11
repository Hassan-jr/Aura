"use server";

import Lora from '@/modals/lora.modal';
import { connect } from "@/db";

interface ImageCaption {
  caption: string;
}

export async function storeLoraData(data: {
  userId: string;
  characterName: string;
  tokenName: string;
  gender: string;
  trainImgs: string[];
  productId: string;
  caption_dropout_rate: number;
  batch_size: number;
  steps: number;
  optimizer: string;
  lr: number;
  quantize: boolean;
  loraPath: string;
  status: string;
}) {
    await connect();

  const lora = new Lora({
    ...data,
    trainImgs: data.trainImgs.map(imgUrl => ({ imgUrl })),
    captions: [],
  });

  await lora.save();
  return lora._id.toString();
}

export async function updateLoraCaptions(documentId: string, captions: ImageCaption[]) {
  await connect();

  // Update the document with the new captions
  const updatedLora = await Lora.findByIdAndUpdate(
      documentId,
      { $set: { captions } },
      { new: true } // This option returns the updated document
  );

  if (!updatedLora) {
      throw new Error(`Document with ID ${documentId} not found`);
  }

  return updatedLora._id.toString();
}

export async function getLoras(){
  try {
    await connect();
      const product_lora = await Lora.find().lean().sort({ createdAt: -1 });
      return JSON.parse(
        JSON.stringify(
          product_lora.map((doc) => ({
            ...doc,
            _id: doc._id.toString(),
            createdAt: doc.createdAt?.toLocaleString(),
            updatedAt: doc.updatedAt?.toLocaleString(),
          }))
        )
      );
  } catch (error) {
    console.log("Error:", error);
    
  }
}