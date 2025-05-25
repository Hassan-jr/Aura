export const config = {
  runtime: "nodejs",
  api: {
    responseLimit: false,
  },
};

import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// --- Model Imports ---
import { Agent } from "@/modals/agent.modal"; // Assuming this path is correct
import { CampaignResult } from "@/modals/campaignResult.modal"; // Adjust path if needed
import { Feedback } from "@/modals/feedback.modal"; // Adjust path if needed
import Lora from "@/modals/lora.modal"; // Adjust path if needed
import { Product } from "@/modals/product.modal"; // *** IMPORT YOUR PRODUCT MODEL *** Adjust path if needed
import { Post } from "@/modals/post.modal"; // Adjust path if needed
// --- End Model Imports ---

import { connect } from "@/db";
import GenerateVisuals from "@/actions/generate.actions"; // *** IMPORT YOUR GenerateVisuals FUNCTION ***
import { generateStructuredContent } from "@/actions/structured.action";

export async function POST(request: NextRequest) {
  const agentId = request.nextUrl.pathname.split("/").pop();
  if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
    return NextResponse.json(
      { error: "Invalid agent ID format" },
      { status: 400 }
    );
  }

  try {
    await connect();
    const body = await request.json();

    // --- Update Agent ---
    const agent = await Agent.findByIdAndUpdate(
      agentId,
      {
        status: "completed",
        results: body.results,
        analysis: body.analysis,
        keyPhrases: body.keyPhrases,
      },
      { new: true } // Return the updated document
    );

    if (!agent) {
      console.log(`Agent not found for ID: ${agentId}`);
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    console.log(`Agent ${agentId} updated successfully.`);

    // --- Start Campaign Processing ---
    console.log(`Starting campaign processing for agent: ${agentId}`);

    // 1. Fetch CampaignResult
    const campaignResult = await CampaignResult.findOne({ agentId: agentId });
    if (!campaignResult) {
      console.error(`CampaignResult not found for agentId: ${agentId}`);
      // Decide if this is a critical error or if processing should stop gracefully
      // return NextResponse.json(
      //   { error: `CampaignResult not found for agent ${agentId}` },
      //   { status: 404 }
      // );
      return NextResponse.json({ success: true });
    }
    console.log(
      `Found CampaignResult: ${campaignResult._id} for agent: ${agentId}`
    );

    // 2. Extract Agent Data for Content Generation
    const hashtags = body?.analysis?.hashtags || [];
    const keySellingPoints = body?.analysis?.content_ideas || []; // Assuming content_ideas are key selling points
    const keyPhrases = body?.keyPhrases || [];
    const content_ideas = body?.analysis?.content_ideas || [];
    const target_audience = body?.analysis?.target_audience || [];
    console.log("Extracted agent analysis data.");

    // 3. Fetch Relevant Feedbacks
    const {
      polarity = [],
      emotion = [],
      rating = [],
    } = campaignResult.sentimentClass || {};
    const feedbackQuery: any = {
      productId: campaignResult.productId,
      // Match if rating is in the campaign result's rating list
      ...(rating.length > 0 && { rating: { $in: rating } }),
      // Match if EITHER polarity OR emotion from the feedback matches the campaign result's lists
      ...((polarity.length > 0 || emotion.length > 0) && {
        $or: [
          ...(polarity.length > 0
            ? [{ "polarity.label": { $in: polarity } }]
            : []),
          ...(emotion.length > 0
            ? [{ "emotion.label": { $in: emotion } }]
            : []),
        ],
      }),
    };

    // Remove the $or clause if both polarity and emotion arrays are empty
    if (!polarity.length && !emotion.length && feedbackQuery.$or) {
      delete feedbackQuery.$or;
    }
    // Ensure there's at least one filter criteria besides productId
    if (Object.keys(feedbackQuery).length <= 1) {
      console.warn(
        `Feedback query for product ${campaignResult.productId} has no sentiment filters. Fetching all feedback for product.`
      );
      // Optionally modify query to fetch *all* feedback if no sentiment criteria,
      // or proceed knowing it might fetch nothing if rating was also empty.
      // Example: Fetch all if no sentiment filters were added:
      // delete feedbackQuery.rating;
      // delete feedbackQuery.$or;
    }

    const relevantFeedbacks = await Feedback.find(feedbackQuery).select(
      "feedback -_id"
    ); // Select only the feedback text
    const feedbackTexts = relevantFeedbacks.map((f) => f.feedback);
    console.log(`Fetched ${feedbackTexts.length} relevant feedback snippets.`);

    // 4. Fetch Lora Data
    const loraData = await Lora.findOne({
      productId: campaignResult.productId,
    });
    if (!loraData || !loraData.loraPath || !loraData.tokenName) {
      console.error(
        `Lora data (loraPath or tokenName) not found for productId: ${campaignResult.productId}`
      );
      // Decide how critical this is. Maybe proceed without image generation?
      // For now, let's return an error as image generation is a core part.
      return NextResponse.json(
        {
          error: `Lora data incomplete or not found for product ${campaignResult.productId}`,
        },
        { status: 404 }
      );
    }
    const { loraPath, tokenName } = loraData;
    console.log(`Found Lora data: path=${loraPath}, token=${tokenName}`);

    // 5. Fetch Product Data
    const product = await Product.findById(campaignResult.productId); // Use your Product model
    if (!product) {
      console.error(
        `Product not found for productId: ${campaignResult.productId}`
      );
      return NextResponse.json(
        { error: `Product not found: ${campaignResult.productId}` },
        { status: 404 }
      );
    }
    console.log(`Found Product: ${product.title}`);
    //    - Description: ${product.description}

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }
    // 6. Prepare data and 7. Call ChatGPT for Content Generation
    let generatedContent;
    try {
      console.log("Calling OpenAI for content generation...");

      generatedContent = await generateStructuredContent(
        tokenName,
        product.title,
        product.description,
        target_audience,
        content_ideas,
        keySellingPoints,
        hashtags,
        keyPhrases,
        feedbackTexts
      );

      if (
        !generatedContent.PostTitle ||
        !generatedContent.PostDescription ||
        !generatedContent.Prompt1 ||
        !generatedContent.Prompt2 ||
        !generatedContent.Prompt3 ||
        !generatedContent.Prompt4
      ) {
        throw new Error("OpenAI response is missing required fields.");
      }
    } catch (error) {
      console.error("Error calling OpenAI or parsing response:", error);
      return NextResponse.json(
        { error: "Failed to generate content via AI" },
        { status: 500 }
      );
    }

    // 8. Generate Visuals
    const allPrompts = [
      generatedContent.Prompt1,
      // generatedContent.Prompt2,
      // generatedContent.Prompt3,
      // generatedContent.Prompt4,
    ];

    // 2. Figure out how many you actually want (default to 4 if missing or >4)
    const n = campaignResult?.numberOfPhotos;
    const count = Number.isInteger(n)
      ? Math.min(Math.max(n, 1), 4) // clamp between 1 and 4
      : 4;

    // 3. Slice and map to the desired shape
    const generations = allPrompts.slice(0, count).map((promptText) => ({
      prompt: promptText,
      negative_prompt: "",
      num_outputs: campaignResult.outputType == "videos" ? 4 : 1,
      width: 1024,
      height: 1024,
      num_inference_steps: 30,
      guidance_scale: 4,
      seed: null,
    }));

    const generationPayload = {
      userId: campaignResult.userId,
      lora_url: loraPath,
      lora_scale: 0.9, // Default value
      productId: campaignResult.productId,
      clientId: "auto", // Default value
      isVideo: campaignResult.outputType == "videos" ? true : false,
      generations: generations,
    };

    let visualGenerationResult;
    try {
      console.log("Calling GenerateVisuals function...");
      visualGenerationResult = await GenerateVisuals(generationPayload);
      if (!visualGenerationResult || !visualGenerationResult.id) {
        throw new Error("GenerateVisuals did not return a valid ID.");
      }
      console.log(
        `Visuals generation initiated successfully. Generation ID: ${visualGenerationResult.id}`
      );
    } catch (error) {
      console.error("Error calling GenerateVisuals:", error);
      // Decide if you should still create the post without the generationId or fail completely
      return NextResponse.json(
        { error: "Failed to generate visuals" },
        { status: 500 }
      );
    }

    // 9. Create Post Document
    let newPost;
    try {
      console.log("Creating new Post document...");
      newPost = await Post.create({
        title: generatedContent.PostTitle,
        description: generatedContent.PostDescription,
        hashtags: hashtags, // Use hashtags from agent analysis
        images: [], // Initially empty, assuming images are linked via generationId later
        userId: campaignResult.userId,
        productId: campaignResult.productId,
        generationId: visualGenerationResult.id, // Link to the visual generation job
      });

      console.log(`Successfully created Post: ${newPost._id}`);
    } catch (error) {
      console.error("Error creating Post document:", error);
      return NextResponse.json({
        success: true,
        warning:
          "Agent updated and content generated, but failed to create Post document.",
      });
    }

    // --- 10 Update Campagin---

    try {
      console.log(
        `Updating CampaignResult ${campaignResult._id} with generationId and postId...`
      );
      const updatedCampaignResult = await CampaignResult.findByIdAndUpdate(
        campaignResult._id, // Use the ID from the campaignResult fetched earlier
        {
          generationId: visualGenerationResult.id, // Set the generation ID from GenerateVisuals
          postId: newPost._id, // Set the post ID from the newly created Post
        },
        { new: true } // Optional: return the updated document
      );

      if (!updatedCampaignResult) {
        // This shouldn't happen if campaignResult was found earlier, but good practice to check
        console.warn(
          `Failed to find CampaignResult ${campaignResult._id} for final update, though it existed before.`
        );
        // Decide if this needs specific error handling or just a warning
      } else {
        console.log(
          `Successfully updated CampaignResult ${updatedCampaignResult._id}`
        );
      }
    } catch (updateError) {
      console.error(
        `Error updating CampaignResult ${campaignResult._id}:`,
        updateError
      );
      // Log the error, but might not need to fail the whole request if post was created.
      // Consider adding this error to the final response message/warning.
      return NextResponse.json({
        success: true,
        warning: `Agent updated, content generated, Post created (${newPost._id}), but failed to update CampaignResult.`,
      });
    }

    console.log(`Campaign processing completed for agent: ${agentId}`);
    return NextResponse.json({
      success: true,
      message:
        "Agent updated and campaign processing initiated successfully. Everything Done",
    });
  } catch (error: any) {
    console.error("Error in webhook processing:", error);
    // Add more specific error logging if needed
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error during webhook processing" },
      { status: 500 }
    );
  }
}
