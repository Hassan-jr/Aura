import mongoose from 'mongoose'

const SentimentSchema = new mongoose.Schema({
    label: {
      type: String
    },
    score: {
      type: Number
    },
  });

const FeedbackSchema = new mongoose.Schema({
  feedback: {
    type: String,
    required: [true, 'Feedback is required'],
  },
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
  },
  polarity: {
    type: [SentimentSchema],
    default: [],
  },
  emotion: {
    type: [SentimentSchema],
    default: [],
  },
}, {
  timestamps: true,
})

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)

