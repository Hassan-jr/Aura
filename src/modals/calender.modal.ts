import mongoose from "mongoose";

const CalenderSchema = new mongoose.Schema(
  {
    GOOGLE_CLIENT_ID: {
      type: String,
      required: true,
    },
    GOOGLE_CLIENT_SECRET: {
      type: String,
      required: true,
    },
    GOOGLE_REFRESH_TOKEN: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Calender =
  mongoose.models.Calender || mongoose.model("Calender", CalenderSchema);
