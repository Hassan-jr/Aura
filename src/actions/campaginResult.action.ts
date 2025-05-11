"use server";

import { connect } from "@/db";
import { CampaignResult } from "@/modals/campaignResult.modal";

export async function createCampaignResult(data) {
  try {
    await connect();

    const CampaignResultData = new CampaignResult({
      ...data,
    });

    await CampaignResultData.save();

    return { mongodbId: CampaignResultData._id.toString() };
  } catch (error) {
    console.error("Error creating CampaignResult:", error);
    throw error;
  }
}

export async function getCampaignResult(id) {
  try {
    await connect();
    const products = await CampaignResult.find({ userId: id })
      .lean()
      .sort({ createdAt: -1 });
    return JSON.parse(
      JSON.stringify(
        products.map((doc) => ({
          ...doc,
          _id: doc._id.toString(),
          createdAt: doc.createdAt?.toLocaleString(),
          updatedAt: doc.updatedAt?.toLocaleString(),
        }))
      )
    );
  } catch (error) {}
}
