"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ImageCaption {
  caption: string;
}

export async function sendToChatGPT(
  imageUrls: string[]
): Promise<ImageCaption[]> {
  if (imageUrls.length <= 0) {
    return [];
  }

  const systemMessage: OpenAI.ChatCompletionMessageParam = {
    role: "system",
    content:
      "You are an expert image analyst and descriptive writer (Image Captioner). Your task is to create brief accurate captions for character images.",
  };

  const userMessages: OpenAI.ChatCompletionMessageParam[] = (() => {
    const images: OpenAI.ChatCompletionContentPartImage[] = imageUrls.map(
      (img) => ({
        type: "image_url",
        image_url: { url: img },
      })
    );

    const message: OpenAI.ChatCompletionMessageParam = {
      role: "user",
      content: [
        {
          type: "text",
          text: "Create a concise caption for this image of a character. Begin with a phrase (eg A photo of a young man/woman, A portrait of a handsome boy/girl etc.) with the character's gender and appearance. Specify the shot type (full body or half body or close-up photo etc) and camera angle (front view, side view, from above etc). Describe the character's pose, gestures, expressions, physical features, clothing, background, any unique attributes and the overall mood of the image. Lastly avoid lengthy captions, aim for around 70 words per caption.",
        },
        ...images,
      ],
    };

    return [message]; // Return an array containing the message
  })();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...userMessages],
      max_tokens: 4000,
      temperature: 0.7,
      tools: [
        {
          type: "function",
          function: {
            name: "generate_image_captions",
            description: "Generate captions for a list of images",
            parameters: {
              type: "object",
              properties: {
                images: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      caption: { type: "string" },
                    },
                    required: ["caption"],
                  },
                },
              },
              required: ["images"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "generate_image_captions" },
      },
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (
      toolCall &&
      toolCall.type === "function" &&
      toolCall.function.name === "generate_image_captions"
    ) {
      const captions: { images: ImageCaption[] } = JSON.parse(
        toolCall.function.arguments
      );

      return captions.images;
    } else {
      console.error("No valid tool call in the response");
      return [];
    }
  } catch (error) {
    console.error("Error sending data to ChatGPT:", error);
    throw error;
  }
}
