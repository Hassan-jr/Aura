"use server";

import mongoose from "mongoose";
import { Campaign } from "@/modals/campaign.modal";
import { connect } from "@/db";

export async function createCampaign(campaignData: any) {
  try {
    await connect();
    const campaign = new Campaign(campaignData);
    await campaign.save();
    return { success: true, campaignId: campaign._id };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { success: false, error: "Failed to create campaign" };
  }
}

export async function fetchCampaigns(userId: string) {
  try {
    await connect();
    const campaigns = await Campaign.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    // return campaigns
    return JSON.parse(
      JSON.stringify(
        campaigns.map((doc) => ({
          ...doc,
          _id: doc._id.toString(),
          createdAt: doc.createdAt?.toISOString(),
          updatedAt: doc.updatedAt?.toISOString(),
        }))
      )
    );
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
}
