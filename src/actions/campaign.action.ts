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

export async function editCampaign(id: string, campaignData: any) {
  try {
    await connect();
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { $set: { ...campaignData } },
      { new: true }
    );
    await campaign.save();
    return { success: true, campaignId: campaign._id };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { success: false, error: "Failed to create campaign" };
  }
}

export async function deleteCampaign(campaignId: string) {
  try {
    await connect();

    // Find by ID and remove
    const result = await Campaign.findByIdAndDelete(campaignId).exec();

    if (!result) {
      // nothing was deleted because the ID didn’t exist
      return { success: false, error: "Campaign not found" };
    }

    return { success: true, deletedId: campaignId };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return { success: false, error: "Failed to delete campaign" };
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
          createdAt: doc.createdAt?.toLocaleString(),
          updatedAt: doc.updatedAt?.toLocaleString(),
        }))
      )
    );
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
}
