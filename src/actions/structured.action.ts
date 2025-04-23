"use server"
import OpenAI from "openai";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod";

// Define the structure OpenAI should return (same as before)
const ContentStructure = z.object({
  PostTitle: z.string().describe("A catchy and engaging title for a social media post (max 100 characters)."),
  PostDescription: z.string().describe("A compelling caption for the social media post (max 500 characters). Incorporate key selling points, address the target audience, and subtly reflect insights from the user feedback if applicable. Include relevant hashtags naturally or at the end."),
  Prompt1: z.string().describe("A detailed image generation prompt (around 75-100 words) starting EXACTLY with '[TOKEN], a photo of [TOKEN]'. Describe a scene showcasing the product in a compelling environment relevant to its use or target audience. Be specific about lighting, style, and mood."),
  Prompt2: z.string().describe("Another detailed image prompt (around 75-100 words), starting EXACTLY with '[TOKEN], a photo of [TOKEN]'. Describe a DIFFERENT scene, potentially focusing on a different key feature or benefit, or a contrasting environment."),
  Prompt3: z.string().describe("A third detailed image prompt (around 75-100 words), starting EXACTLY with '[TOKEN], a photo of [TOKEN]'. Explore another distinct visual concept."),
  Prompt4: z.string().describe("A fourth detailed image prompt (around 75-100 words), starting EXACTLY with '[TOKEN], a photo of [TOKEN]'. Offer a final unique visual angle.")
});

// Type alias for the structure defined by the Zod schema
type GeneratedContentType = z.infer<typeof ContentStructure>;

// Initialize OpenAI Client (ensure API key is set in your environment variables)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates structured promotional content using OpenAI based on provided data.
 * Focuses solely on the OpenAI interaction and structured output parsing.
 *
 * @param {string} tokenName - The specific token name to be used in image prompts (e.g., "myproduct_v1").
 * @param {any} productTitle - The title of the product (expected: string).
 * @param {any} productDescription - The description of the product (expected: string).
 * @param {any} targetAudience - Array of target audience descriptions (expected: string[]).
 * @param {any} contentIdeas - Array of content ideas (expected: string[]).
 * @param {any} keySellingPoints - Array of key selling points (expected: string[]).
 * @param {any} hashtags - Array of relevant hashtags (expected: string[]).
 * @param {any} keyPhrases - Array of key marketing phrases (expected: string[]).
 * @param {any} feedbackTexts - Array of user feedback snippets (expected: string[]).
 *
 * @returns {Promise<GeneratedContentType>} A promise that resolves with the structured content object.
 * @throws {Error} Throws an error if the OpenAI API key is missing, the API call fails, or the response parsing fails.
 */
export async function generateStructuredContent(
  tokenName: string,
  productTitle: any,       // Expected: string
  productDescription: any, // Expected: string
  targetAudience: any,     // Expected: string[]
  contentIdeas: any,       // Expected: string[]
  keySellingPoints: any,   // Expected: string[]
  hashtags: any,           // Expected: string[]
  keyPhrases: any,         // Expected: string[]
  feedbackTexts: any       // Expected: string[]
): Promise<GeneratedContentType> {
  console.log(`[generateStructuredContent] Starting content generation for token: ${tokenName} and product: ${productTitle}`);

  // 1. Check for OpenAI API Key
  if (!process.env.OPENAI_API_KEY) {
    console.error("[generateStructuredContent] OpenAI API key is not configured in environment variables.");
    throw new Error("OpenAI API key not configured.");
  }

  // 2. Helper function to safely join array data (handles non-arrays/empty arrays)
  const safeJoin = (data: any, separator = ", ", defaultVal = "Not specified"): string => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map(item => String(item)).join(separator); // Ensure items are strings
    }
    return defaultVal;
  };

  // 3. Prepare data for the prompt, using safe joining and string conversion
  const titleString = String(productTitle || "Untitled Product");
  const descriptionString = String(productDescription || "No description provided.");
  const audienceString = safeJoin(targetAudience);
  const ideasString = safeJoin(contentIdeas);
  const sellingPointsString = safeJoin(keySellingPoints);
  const hashtagsString = safeJoin(hashtags);
  const keyPhrasesString = safeJoin(keyPhrases);

  const feedbackString = (Array.isArray(feedbackTexts) && feedbackTexts.length > 0)
    ? feedbackTexts.map((f: any) => `- "${String(f)}"`).join("\n") // Ensure feedback is string
    : "- No specific feedback provided for this sentiment selection.";

  // 4. Construct the System Prompt using Parameter Data
  const systemPrompt = `
    Generate promotional content in a valid JSON format based on the provided product details, market analysis, and feedback.

    Product Information:
    - Title: ${titleString}
    - Description: ${descriptionString}

    Market Analysis Insights:
    - Target Audience: ${audienceString}
    - Content Ideas: ${ideasString}
    - Key Selling Points: ${sellingPointsString}
    - Relevant Hashtags: ${hashtagsString}
    - Key Phrases: ${keyPhrasesString}

    User Feedback Snippets (Reflecting various sentiments):
    ${feedbackString}

    Instructions:
    Generate ONLY a valid JSON object matching the requested schema.
    Use the provided token name "${tokenName}" EXACTLY where specified (prefixed like "${tokenName}, a photo of ${tokenName}") in the image prompts (Prompt1, Prompt2, Prompt3, Prompt4).
    Make the prompts creative, visually descriptive, and distinct from each other for an AI image generator. Ensure the prompts are around 75-100 words each.
    Ensure PostTitle is max 100 chars and PostDescription is max 500 chars.
    `;

  // 5. Call OpenAI API with Structured Output Formatting
  try {
    console.log("[generateStructuredContent] Calling OpenAI API (model: gpt-4o) with provided parameters...");
    const chatResponse = await openai.responses.parse({
        model: "gpt-4o", // Or specify a version like "gpt-4o-2024-08-06"
      input: [
        {
          role: "system",
          content: "You are an expert product marketing content creator specializing in social media promotion. Generate compelling promotional content structured as a JSON object based on the details provided by the user.",
        },
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      text: {
        format: zodTextFormat(ContentStructure, "generated_content")
      }
      // temperature: 0.8, // Optional: Adjust creativity
    });

    console.log("[generateStructuredContent] OpenAI API call successful.");

    // 6. Extract and Validate Parsed Content
    const generatedContent = chatResponse.output_parsed;

    if (!generatedContent || typeof generatedContent !== 'object') {
      console.error("[generateStructuredContent] Parsed content is not a valid object or is null/empty.", generatedContent);
      throw new Error("Parsed content from OpenAI is not a valid object.");
    }

    console.log("[generateStructuredContent] Successfully received and parsed content from OpenAI:", generatedContent);

    // 7. Return the structured content
    return generatedContent;

  } catch (error: any) {
    // Consistent detailed error logging from the previous version
    console.error("--------------------------------------------------");
    console.error("[generateStructuredContent] FAILED: Error during OpenAI API call or parsing.");
    console.error("Error Type:", error?.constructor?.name);
    console.error("Error Message:", error.message);
    if (error.status) console.error("API Status Code:", error.status);
    if (error.code) console.error("API Error Code:", error.code);
    if (error.response?.data) console.error("API Response Data:", JSON.stringify(error.response.data, null, 2));
    console.error("--- System Prompt Sent to OpenAI ---");
    console.error(systemPrompt);
    console.error("--------------------------------------------------");
    throw new Error(`[generateStructuredContent] Failed to generate/parse content from OpenAI. Reason: ${error.message}`);
  }
}

// --- Example Usage (within an async Next.js API route or server component) ---
/*
async function testGenerationWithParams() {
  const testData = {
    tokenName: "coolwidget_v3",
    productTitle: "The Amazing CoolWidget",
    productDescription: "A revolutionary widget that solves all your coolness needs. Sleek design, multiple colors.",
    targetAudience: ["Tech enthusiasts", "Gadget lovers", "Early adopters"],
    contentIdeas: ["Showcase unboxing", "Demonstrate key feature X", "Lifestyle shot with widget"],
    keySellingPoints: ["Ultra portable", "Long battery life", "Intuitive controls"],
    hashtags: ["#coolwidget", "#gadget", "#tech", "#innovation"],
    keyPhrases: ["experience the cool", "widget like never before"],
    feedbackTexts: ["Wow, this is much smaller than I expected!", "Battery lasts forever!", "Setup was a breeze."]
  };

  try {
    const content = await generateStructuredContent(
      testData.tokenName,
      testData.productTitle,
      testData.productDescription,
      testData.targetAudience,
      testData.contentIdeas,
      testData.keySellingPoints,
      testData.hashtags,
      testData.keyPhrases,
      testData.feedbackTexts
    );
    console.log("Successfully generated content with params:", content);
    // Use the content object...
  } catch (error) {
    console.error("Error in testGenerationWithParams:", error);
  }
}

// Call it somewhere appropriate in your server-side code
// testGenerationWithParams();
*/