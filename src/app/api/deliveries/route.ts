import { connect } from "@/db";
import { Delivery } from "@/modals/webhook.modal";
import { NextResponse } from "next/server";
// Adjust path to your Delivery model file

export async function GET() {
  try {
    // 1. Establish Database Connection (using Mongoose)
    // This utility typically checks if a connection exists or creates one.
    await connect();

    // 2. Query the Database using the Mongoose Model
    // We use the Delivery model directly, which corresponds to the 'deliveries' collection.
    const deliveries = await Delivery.find({}) // Find documents (no specific filter here)
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order (latest first)
      .limit(50) 
      .lean(); // Use .lean() to get plain JavaScript objects instead of Mongoose documents.
               // This is faster for read operations and helps with serialization (e.g., _id conversion).
    return NextResponse.json(deliveries);

  } catch (error) {
    // 4. Error Handling
    console.error("Error fetching deliveries:", error);
    // Return a standard error response
    return NextResponse.json(
      { message: "Failed to fetch deliveries", error: error.message }, // Include error message for debugging if desired
      { status: 500 }
    );
  }
}