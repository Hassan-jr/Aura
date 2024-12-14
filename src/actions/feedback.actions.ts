'use server'

import { connect } from '@/db'
import { Feedback } from '@/modals/feedback.modal'

type Sentiment = {
    label: string;
    score: number;
  };

interface FeedbackData {
  feedback: string;
  productId: string;
  rating: number;
  userId: string;
  polarity: Sentiment[];
  emotion: Sentiment[];
}

export async function submitFeedback(data: FeedbackData) {
  try {
    await connect()
    const feedback = new Feedback(data)
    const savedFeedback = await feedback.save()
    return {id: savedFeedback._id.toString(), success: true, message: 'Feedback submitted successfully' }
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return { success: false, message: 'Failed to submit feedback' }
  }
}

