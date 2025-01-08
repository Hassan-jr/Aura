"use server";

import { Agent } from "@/modals/agent.modal";
import { connect } from "@/db";
import axios from "axios";

export async function createAgent(
  query: string,
  userId: string,
  productId: string
) {
  try {
    await connect();

    const agent = new Agent({
      title: query,
      userId: userId,
      productId: productId,
      status: "pending",
    });

    await agent.save();

    console.log("Mongodb Created");
    

    const webhookURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/agent/${agent._id}`;

    // const response = await fetch('https://social-media-seo-agent.onrender.com/api/agent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     query,
    //     webhookURL,
    //     mongodbId: agent._id.toString(),
    //   }),
    // })

    const response = await axios.post(
      "https://social-media-seo-agent.onrender.com/api/agent",
      {
        query,
        webhookURL,
        mongodbId: agent._id.toString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response sent and received");
    

    // if (!response.ok) {
    //   throw new Error('Failed to start analysis')
    // }

    if (response.status !== 200) {
      throw new Error("Failed to start analysis");
    }

    return { mongodbId: agent._id.toString() };
  } catch (error) {
    console.error("Error creating Agent:", error);
    throw error;
  }
}
