import mongoose from 'mongoose'

const AgentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this run.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  userId: {
    type: String,
    required: [true, 'You should be logged in to create a run.'],
  },
  productId: {
    type: String,
    required: [true, 'You should a productId.'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  analysis: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  keyPhrases: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
})

export const Agent = mongoose.models.Agent || mongoose.model('Agent', AgentSchema)

