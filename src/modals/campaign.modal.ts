import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    productId: {
      type: String,
      required: [true, "User ID is required"],
    },
    runId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Run",
      required: [true, "Run ID is required"],
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "now"],
      required: [true, "Frequency is required"],
    },
    scheduledTime: {
      type: Date,
      required: [true, "Scheduled time is required"],
    },
    outputType: {
      type: String,
      enum: ["photos", "videos", "both"],
      default: "photos",
    },
    numberOfPhotos: {
      type: Number,
      min: 1,
      max: 4,
      default: 4,
    },
    sentimentClass: {
      polarity: [{ type: String }],
      emotion: [{ type: String }],
      rating: [{ type: Number }],
    },
    newRun: { type: Boolean, default: false },
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

export const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
