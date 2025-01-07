'use server'

import { connect } from '@/db'
import { ChatMessage } from '@/modals/chatMessage.modal'

interface ChatMessageData {
  role: 'user' | 'assistant'
  content: string
}

export async function saveChatMessage(data: ChatMessageData) {
  try {
    await connect()
    const chatMessage = new ChatMessage(data)
    await chatMessage.save()
    return { success: true, message: 'Chat message saved successfully' }
  } catch (error) {
    console.error('Failed to save chat message:', error)
    return { success: false, message: 'Failed to save chat message' }
  }
}

