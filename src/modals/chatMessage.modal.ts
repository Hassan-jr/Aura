import mongoose from 'mongoose'

const ChatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: [true, 'Role is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
  },
  bId: {
    type: String,
    required: [true, 'User ID is required'],
  }
}, {
  timestamps: true,
})

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema)

