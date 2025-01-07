import mongoose from "mongoose";

// Define schemas for new collections
const DiscountSchema = new mongoose.Schema(
  {
    userId: String,
    bId: String,
    productId: String,
    agreedDiscountRate: Number,
    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

export const Discount = mongoose.models.Discount || mongoose.model('Discount', DiscountSchema);
