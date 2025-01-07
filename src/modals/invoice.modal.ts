import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    userId: String,
    bId: String,
    productId: String,
    qty: Number,
    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

export const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
