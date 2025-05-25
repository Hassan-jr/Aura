"use server";
import OpenAI from "openai";

// Define the shape of the sentiment probabilities
export type SentimentResult = {
  Sad: number;
  Happy: number;
  Love: number;
  Angry: number;
  Fearful: number;
  Surprised: number;
};

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Classify sentiment of a given review into predefined categories with probabilities.
 * @param review - The text review to classify.
 * @returns An object with keys for each sentiment and probabilities summing to 1.
 */
export async function classifySentiment(
  review: string
): Promise<SentimentResult> {
  // Compose the prompt for classification
  const systemPrompt = `You are a sentiment analysis model. Given a user review, you must output the prediction probabilities for each of the following classes:
- Sad
- Happy
- Love
- Angry
- Fearful
- Surprised

The review sentiment will be the class with the highest prediction probabilities and the highest class must always have more than 0.5. 
the prediction probabilities of every class must always be different from each other. The result should be as realistic as possible.
Respond with a JSON object and no additional text. Use floats between 0 and 1, each with four decimal places, and ensure they sum to exactly 1. Example format:

{ "Sad": 0.1234, "Happy": 0.2345, "Love": 0.3456, "Angry": 0.0123, "Fearful": 0.0456, "Surprised": 0.2386 };
`;

  const userPrompt = `Review: "${review.replace(/"/g, '"')}"`;

  // Call the OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0,
    max_tokens: 200,
  });

  const content = response.choices[0].message?.content?.trim();
  if (!content) {
    throw new Error("Empty response from OpenAI API");
  }

  let result: SentimentResult;
  try {
    // Parse the JSON output
    result = JSON.parse(content) as SentimentResult;
  } catch (err) {
    throw new Error(`Failed to parse JSON from model response: ${err}`);
  }

  // Optionally, you could normalize or validate here
  const sum = Object.values(result).reduce((acc, v) => acc + v, 0);
  if (Math.abs(sum - 1) > 1e-4) {
    throw new Error(`Probabilities do not sum to 1 (sum=${sum})`);
  }

  return result;
}
