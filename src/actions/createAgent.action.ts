'use server'

import { Agent } from "@/modals/agent.modal"
import { connect } from "@/db";

export async function createAgent(query: string, userId: string, productId: string) {
  try {
    await connect()

    const agent = new Agent({
      title: query,
      userId: userId,
      productId: productId,
      status: 'pending',
    })

    await agent.save()

    const webhookURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/agent/${agent._id}`

    const response = await fetch('https://social-media-seo-agent.onrender.com/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        webhookURL,
        mongodbId: agent._id.toString(),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to start analysis')
    }

    return { mongodbId: agent._id.toString() }
  } catch (error) {
    console.error('Error creating Agent:', error)
    throw error
  }
}

