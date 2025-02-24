'use client'
import React from "react";
import feedbackEntries from "./feebackData";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/actions/feedback.actions";

const InsertFeed = () => {
  async function insertFeedbacks() {
    const feedbacks = feedbackEntries;
    for (const feedback of feedbacks) {
      try {
        const savedFeedback = await submitFeedback({
          feedback: feedback.feedback,
          productId: feedback.productId,
          rating: feedback.rating,
          userId: feedback.userId,
          polarity: feedback.polarity,
          emotion: feedback.emotion,
        });
        console.log(
          `Feedback from user ${feedback.userId} inserted successfully.`
        );
      } catch (error) {
        console.error(
          `Failed to insert feedback for user ${feedback.userId}:`,
          error
        );
      }
    }
  }

  return (
    <Button className="bg-black text-white w-full" onClick={insertFeedbacks}>
      Insert All Feedbacks
    </Button>
  );
};

export default InsertFeed;
