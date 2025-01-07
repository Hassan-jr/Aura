'use server'

import mongoose from 'mongoose'

import { Agent } from "@/modals/agent.modal"
import { connect } from "@/db";


export async function fetchAgent(userId: string) {
  try {
    await connect()

    const agent = await Agent.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    return agent
  } catch (error) {
    console.error('Error fetching agent:', error)
    throw error
  } finally {
    await mongoose.disconnect()
  }
}

