import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db";
import Generation from "@/modals/generations.modal";
import { Post } from "@/modals/post.modal";
import { Campaign } from "@/modals/campaign.modal";
import { CampaignResult } from "@/modals/campaignResult.modal";
import user from "@/modals/user.modal";
import { Feedback } from "@/modals/feedback.modal";
import {
  EmotionLabel,
  PolarityLabel,
} from "@/components/sentiment/component/types";
import { sendPostEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  // Extract the ID from the URL
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const data = await request.json();

    // Update the Generation document
    if (data.status === "COMPLETED") {
      await Generation.findByIdAndUpdate(id, {
        generations: data.output.generations,
      });
    }

    const getImageUrls = (gens) => {
      const nested = gens?.map((gen2) =>
        gen2?.images?.map((image) => `https://r2.nomapos.com/${image.url}`)
      );
      const urls = nested?.flat(2);
      console.log("urls:", urls);

      return urls?.length > 0
        ? urls
        : ["https://r2.nomapos.com/CSC416/loadingImage.svg"];
    };

    // optional
    // 1. find a post with the generationid and get post title, post description and postId
    const post = await Post.findOne({
      generationId: id,
    });

    // 2 get capmapgn since post exits
    if (post._id) {
      const campaginResult = await CampaignResult.findOne({
        generationId: id,
      });
      // users

      const feedbacks = await Feedback.find({
        productId: campaginResult.productId,
      });
      const filteredFeedback = feedbacks.filter((item) => {
        const polarityMatch = campaginResult.sentimentClass.polarity?.map(
          (selectedPolarity) =>
            selectedPolarity.length === 0 ||
            selectedPolarity.includes(
              item.polarity.reduce((a, b) => (a.score > b.score ? a : b))
                .label as PolarityLabel
            )
        );
        const emotionMatch = campaginResult.sentimentClass.emotion?.map(
          (selectedEmotions) =>
            selectedEmotions.length === 0 ||
            selectedEmotions.includes(
              item.emotion.reduce((a, b) => (a.score > b.score ? a : b))
                .label as EmotionLabel
            )
        );
        const ratingMatch = campaginResult.sentimentClass.rating?.map(
          (selectedRatings) => selectedRatings == item.rating
        );
        return polarityMatch && emotionMatch && ratingMatch;
      });

      const uniqueUserIds = [
        ...new Set(filteredFeedback.map((fb) => fb.userId)),
      ];
      const images = getImageUrls(data.output.generations);
      const emailPromises = uniqueUserIds.map((userId) =>
        sendPostEmail(userId, images, post.title, post.description)
      );
      const results = await Promise.allSettled(emailPromises);
    }

    // if user requested
    const generations = await Generation.findById(id);
    console.log("generations:", generations);

    if (generations && generations.clientId != "auto") {
      const images = getImageUrls(data.output.generations);
      sendPostEmail(generations.clientId, images, "", "");
    }
    //
    // Return a 200 status to acknowledge successful receipt
    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
