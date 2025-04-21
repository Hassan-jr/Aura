"use server";
import Generation from "@/modals/generations.modal";
import { connect } from "@/db";
import runpodSdk from "runpod-sdk";

/**
 * Creates a new Generation document in the database and returns its ID.
 *
 * @param {string} userId - The ID of the user associated with the generation (required).
 * * @param {string} for -  who is resbonsile for the generation "auto" or clientId.
 * @param {string} [loraUrl] - The URL of the LORA used (optional).
 * @param {number} [lora_scale] - The scale of the LORA used (optional).
 * @param {string} [productId] - The ID of the product associated (optional).
 * @param {Array<Object>} [generations=[]] - An array of arbitrary objects representing the generations (optional, defaults to empty array).
 * @returns {Promise<ObjectId|null>} A promise that resolves with the ObjectId of the created document, or null if an error occurred.
 */

const runpod = runpodSdk(process.env.NEXT_PUBLIC_RUNPOD_VISION_API_KEY);
const endpoint = runpod.endpoint(process.env.NEXT_PUBLIC_GEN_ENDPOINT_ID);

async function GenerateVisuals({
  userId,
  lora_url,
  lora_scale,
  productId,
  clientId = "auto",
  generations = [], // Default to empty array if not provided
}) {
  // Basic validation for required field
  if (!userId) {
    console.error("Error: userId is required to create a Generation document.");
    return null;
  }

  try {
    await connect();
    // Create a new instance of the Generation model
    const newGeneration = new Generation({
      userId,
      lora_url,
      lora_scale,
      clientId,
      productId,
      generations,
    });

    // Save the new document to the database
    const savedDocument = await newGeneration.save();
    const instanceId = savedDocument._id;

    const result = await endpoint.run({
      input: {
        instanceId,
        lora_url,
        lora_scale,
        generations,
        r2_bucket_name: process.env.NEXT_PUBLIC_R2_VISION_BUCKET_NAME,
        r2_access_key_id: process.env.NEXT_PUBLIC_R2_VISION_ACCESS_KEY_ID,
        r2_secret_access_key:
          process.env.NEXT_PUBLIC_R2_VISION_SECRET_ACCESS_KEY,
        r2_endpoint_url: process.env.NEXT_PUBLIC_R2_VISION_ENDPOINT_URL,
        r2_path_in_bucket: `${process.env.NEXT_PUBLIC_R2_GEN_PATH_IN_BUCKET}/${instanceId}`,
      },
      webhook: `https://inprimeai.vercel.app/api/webhooks/gen/${instanceId}`,
      policy: {
        executionTimeout: 1000 * 60 * 3,
      },
    });

    // Return the ID of the saved document
    return result;
  } catch (error) {
    console.error("Error creating Generation document:", error);
    return null; // Return null or throw the error, depending on desired error handling
  }
}

export default GenerateVisuals;

export async function getGenerations() {
  try {
    await connect();
    const generationsData = await Generation.find()
      .lean()
      .sort({ createdAt: -1 });
    return JSON.parse(
      JSON.stringify(
        generationsData.map((doc) => ({
          ...doc,
          _id: doc._id.toString(),
          createdAt: doc.createdAt?.toISOString(),
          updatedAt: doc.updatedAt?.toISOString(),
        }))
      )
    );
  } catch (error) {
    console.log("Error:", error);
  }
}
