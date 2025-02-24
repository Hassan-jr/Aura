"use server";

import { Agent } from "@/modals/agent.modal";
import { connect } from "@/db";

export async function fetchAgent(userId: string) {
  try {
    await connect();

    const agent = await Agent.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // return agent
    return JSON.parse(
      JSON.stringify(
        agent.map((doc) => ({
          ...doc,
          _id: doc._id.toString(),
          createdAt: doc.createdAt?.toISOString(),
          updatedAt: doc.updatedAt?.toISOString(),
        }))
      )
    );
  } catch (error) {
    console.error("Error fetching agent:", error);
    throw error;
  }
}
