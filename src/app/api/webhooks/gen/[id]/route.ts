import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db";
import Generation from "@/modals/generations.modal";

export async function POST(request: NextRequest) {
  // Extract the ID from the URL
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const data = await request.json();

    // Update the Generation document
    if (data.status === "COMPLETED") {
      await Generation.findByIdAndUpdate(id, {
        generations: data.output.generations,
      });
    }

    // Return a 200 status to acknowledge successful receipt
    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
