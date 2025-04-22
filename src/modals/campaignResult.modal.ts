import mongoose from "mongoose";

const CampaignResultSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    outputType: {
        type: String,
        required: true,
    },
    numberOfPhotos: {
        type: Number,
        required: true,
    },
    productId: {
      type: String,
      required: [true, "Product ID is required"],
    },
    agentId: {
      type: String,
      required: true,
    },
    campaignId: {
      type: String,
      required: true,
    },

    generationId: {
      type: String,
      required: false,
    },

    postId: {
      type: String,
      required: false,
    },

    sentimentClass: {
      polarity: [{ type: String }],
      emotion: [{ type: String }],
      rating: [{ type: Number }],
    },

    publishSites: {
      facebook: Boolean,
      instagram: Boolean,
      twitter: Boolean,
      emailMarketing: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const CampaignResult =
  mongoose.models.CampaignResult ||
  mongoose.model("CampaignResult", CampaignResultSchema);
