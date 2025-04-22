"use server";


import { connect } from "@/db";
import { CampaignResult } from "@/modals/campaignResult.modal";

export async function createCampaignResult(
  data
) {
  try {
    await connect();

    const CampaignResultData = new CampaignResult({
      ...data
    });

    await CampaignResultData.save();

    return { mongodbId: CampaignResultData._id.toString() };
  } catch (error) {
    console.error("Error creating CampaignResult:", error);
    throw error;
  }
}
