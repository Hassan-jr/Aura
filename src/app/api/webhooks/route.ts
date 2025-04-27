import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { connect } from "@/db";
import { Webhook } from "@/modals/webhook.modal";

export async function GET() {
  try {
    await connect();

    const webhooks = await Webhook.find({}).lean();

    return NextResponse.json(
      webhooks.map((webhook) => ({
        ...webhook,
        _id: webhook._id.toString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching webhooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch webhooks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const webhook = await request.json();
    const webhookdata = new Webhook(webhook);

    await connect();

    const result = await webhookdata.save();

    return NextResponse.json(
      {
        _id: result?.insertedId?.toString(),
        ...webhook,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating webhook:", error);
    return NextResponse.json(
      { error: "Failed to create webhook" },
      { status: 500 }
    );
  }
}
