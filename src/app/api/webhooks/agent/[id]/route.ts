import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Agent } from "@/modals/agent.modal";
import { connect } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const body = await request.json();

    await connect();

    const agent = await Agent.findByIdAndUpdate(
      id,
      {
        status: "completed",
        results: body.results,
        analysis: body.analysis,
        keyPhrases: body.keyPhrases,
      },
      { new: true }
    );

    if (!agent) {
      return NextResponse.json({ error: "agent not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
