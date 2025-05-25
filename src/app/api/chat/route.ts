import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connect } from "@/db";
import { ChatMessage } from "@/modals/chatMessage.modal";

// Add new models for discounts and invoices
import { Discount } from "@/modals/discount.modal";
import { Invoice } from "@/modals/invoice.modal";
import { sendDiscountEmail, sendInvoiceEmail } from "@/lib/email"; // Assuming email functions exist
import Lora from "@/modals/lora.modal";
import GenerateVisuals from "@/actions/generate.actions";

// runpod (Adjust if needed, ensure OPENAI_API_KEY is set correctly)
// const OPENAI_BASE_URL = "https://api.runpod.ai/v2/rbcnd8mh4k6vae/openai/v1";
// const OPENAI_API_KEY = process.env.NEXT_PUBLIC_RUNPOD_API_KEY;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the official OpenAI API key
  // apiKey: OPENAI_API_KEY, // Uncomment/switch if using Runpod
  // baseURL: OPENAI_BASE_URL, // Uncomment/switch if using Runpod
});

//  send webhook data
async function sendWebhook({
  bId,
  eventName,
  userDetails,
  productDetails,
  payload,
}) {
  try {
    const url1 =
      process.env.NODE_ENV == "development"
        ? `${process.env.NEXTAUTH_URL}api/webhooks`
        : `${process.env.NEXT_PUBLIC_APP_URL}api/webhooks`;

    // get the webhook even first
    const response1 = await fetch(url1);
    const data = await response1.json();
    const webhook = data?.find((dat) => dat.bId == bId);
    console.log("Webhook 4:", webhook);

    const webhookId = webhook?._id?.toString();
    let webhookDataToSend = {};
    if (eventName == "discount" && webhook?.events?.discountSent) {
      // set discount payload here
      webhookDataToSend = {
        webhookId: webhookId,
        event: "discount_sent",
        payload: {
          user: userDetails,
          product: productDetails,
          discount: payload,
        },
      };
    }
    if (eventName == "invoice" && webhook?.events?.invoiceIssued) {
      // set invoice payload here
      webhookDataToSend = {
        webhookId: webhookId,
        event: "invoice_issued",
        payload: {
          user: userDetails,
          product: productDetails,
          invoice: payload,
        },
      };
    }
    if (eventName == "meeting" && webhook?.events?.meetingScheduled) {
      // set meeting payload here
      webhookDataToSend = {
        webhookId: webhookId,
        event: "meeting_scheduled",
        payload: {
          user: userDetails,
          product: productDetails,
          meeting: payload,
        },
      };
    }

    // send webhook
    const url =
      process.env.NODE_ENV == "development"
        ? `${process.env.NEXTAUTH_URL}api/deliveries/send`
        : `${process.env.NEXT_PUBLIC_APP_URL}api/deliveries/send`;

    console.log("webhookDataToSend: ", webhookDataToSend);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookDataToSend),
    });
    return response;
  } catch (error) {
    console.log("An Error Occured Sending Webhook:", error);
  }
}

// Function to handle "giving discounts"
async function handleDiscount(
  userId: string,
  bId: string,
  productId: string,
  agreedDiscountRate: number,
  expiresIn: number, // Changed from expiryDate to expiresIn,
  userDetails,
  productDetails
) {
  const currentDate = new Date();
  const expiryDate = new Date();
  // Ensure expiresIn is at least 1 day if not specified or invalid
  const validExpiresIn = Math.max(1, expiresIn || 1);
  expiryDate.setDate(expiryDate.getDate() + validExpiresIn);

  // Find an existing discount where expiryDate has not passed
  const existingDiscount = await Discount.findOne({
    userId,
    bId,
    productId,
    expiryDate: { $gt: currentDate },
  });

  if (existingDiscount) {
    // Discount has not expired, update it
    existingDiscount.agreedDiscountRate = agreedDiscountRate;
    existingDiscount.expiryDate = expiryDate;
    await existingDiscount.save();
    // Assuming sendDiscountEmail is adapted for expiryDate
    await sendDiscountEmail(userId, agreedDiscountRate, productId, expiryDate);
    await sendWebhook({
      bId,
      eventName: "discount",
      userDetails,
      productDetails,
      payload: existingDiscount,
    });
    return existingDiscount;
  } else {
    // No valid discount found, create a new one
    const newDiscount = await Discount.create({
      userId,
      bId,
      productId,
      agreedDiscountRate,
      expiryDate,
    });
    await sendDiscountEmail(userId, agreedDiscountRate, productId, expiryDate);
    await sendWebhook({
      bId,
      eventName: "discount",
      userDetails,
      productDetails,
      payload: {
        userId,
        bId,
        productId,
        agreedDiscountRate,
        expiryDate,
      },
    });
    return newDiscount;
  }
}

// Function to handle "issuing invoices"
async function handleInvoice(
  userId: string,
  bId: string,
  productId: string,
  qty: number = 1,
  expiresIn: number, // Changed from expiryDate to expiresIn
  userDetails,
  productDetails
) {
  const currentDate = new Date();
  const expiryDate = new Date();
  // Ensure expiresIn is at least 1 day if not specified or invalid
  const validExpiresIn = Math.max(1, expiresIn || 1);
  expiryDate.setDate(expiryDate.getDate() + validExpiresIn);

  // Find an existing invoice where expiryDate has not passed
  const existingInvoice = await Invoice.findOne({
    userId,
    bId,
    productId,
    expiryDate: { $gt: currentDate },
  });

  if (existingInvoice) {
    existingInvoice.qty = qty;
    existingInvoice.expiryDate = expiryDate;
    await existingInvoice.save();
    // send invoice email
    await sendInvoiceEmail(userId, productId, expiryDate, qty);
    await sendWebhook({
      bId,
      eventName: "invoice",
      userDetails,
      productDetails,
      payload: existingInvoice,
    });
    return existingInvoice;
  } else {
    const invoice = await Invoice.create({
      userId,
      bId,
      productId,
      qty,
      expiryDate,
    });
    await sendInvoiceEmail(userId, productId, expiryDate, qty);
    await sendWebhook({
      bId,
      eventName: "invoice",
      userDetails,
      productDetails,
      payload: {
        userId,
        bId,
        productId,
        qty,
        expiryDate,
      },
    });
    return invoice;
  }
}

// --- NEW: Function to handle Meeting Scheduling ---
async function handleScheduleMeeting({
  userId,
  bId,
  productId,
  userEmail, // Email of the user requesting the meeting
  myEmail, // Your email (the representative)
  summary,
  description,
  requestedStartTime, // Optional: Time suggested by LLM if user specified
  clientId,
  clientSecret,
  refreshToken,
  userDetails,
  productDetails,
}: {
  userId: string;
  bId: string;
  productId: string;
  userEmail: string;
  myEmail: string;
  summary: string;
  description: string;
  requestedStartTime?: string; // ISO String or undefined
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  userDetails: any;
  productDetails: any;
}) {
  let startTime: Date;
  let endTime: Date;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (requestedStartTime) {
    // If LLM provided a specific start time (parsed from user request)
    try {
      startTime = new Date(requestedStartTime);
      // Basic validation: check if date is valid and in the future
      if (isNaN(startTime.getTime()) || startTime < new Date()) {
        console.warn(
          "Invalid requestedStartTime, defaulting to next hour:",
          requestedStartTime
        );
        // Fallback to default if invalid or past time
        startTime = new Date();
        startTime.setHours(startTime.getHours() + 1);
        startTime.setMinutes(0, 0, 0);
      }
    } catch (e) {
      console.error(
        "Error parsing requestedStartTime, defaulting to next hour:",
        e
      );
      // Fallback to default on parsing error
      startTime = new Date();
      startTime.setHours(startTime.getHours() + 1);
      startTime.setMinutes(0, 0, 0);
    }
  } else {
    // Default: Schedule for the start of the next hour
    startTime = new Date();
    startTime.setHours(startTime.getHours() + 1);
    startTime.setMinutes(0, 0, 0); // Set minutes, seconds, ms to 0
  }

  // Calculate end time (1 hour after start time)
  endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds

  const bodyData = {
    userEmail,
    summary,
    description,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    timeZone,
    //   others
    userId,
    bid: bId, // Ensure field names match your /api/schedule-meet expectation
    productId,
    clientId,
    clientSecret,
    refreshToken,
    myEmail,
  };

  console.log("Scheduling meeting with data:", bodyData);

  try {
    // IMPORTANT: Replace with your actual internal API endpoint URL if needed
    // Using relative path assumes it's hosted on the same origin
    const url =
      process.env.NODE_ENV == "development"
        ? `${process.env.NEXTAUTH_URL}api/schedule-meet`
        : `${process.env.NEXT_PUBLIC_APP_URL}api/schedule-meet`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Error scheduling meeting: ${response.status} ${response.statusText}`,
        errorBody
      );
      throw new Error(`Failed to schedule meeting. Status: ${response.status}`);
    }

    const { eventData } = await response.json(); // Assuming your API returns { eventData: { hangoutLink: '...', ... } }

    console.log("Meeting scheduled successfully:", eventData);

    await sendWebhook({
      bId,
      eventName: "meeting",
      userDetails,
      productDetails,
      payload: eventData,
    });

    // Return success details (e.g., link and time) to be sent to the user
    return {
      success: true,
      message: `Okay, I've scheduled a meeting for you. Start time: ${startTime.toLocaleString()}. You should receive a Google Calendar invite shortly. ${
        eventData?.meetLink ? `Join here: ${eventData.meetLink}` : ""
      }`,
      scheduledStartTime: startTime, // Return the actual scheduled time
      hangoutLink: eventData?.meetLink,
    };
  } catch (error: any) {
    console.error("Error calling /api/schedule-meet:", error);
    return {
      success: false,
      message:
        "Sorry, I encountered an error while trying to schedule the meeting. Please try asking again later.",
      error: error.message,
    };
  }
}

// generate images

async function generateImages({
  prompt1,
  prompt2,
  prompt3,
  prompt4,
  productId,
  userId,
  bId,
  replaceTrigger,
}) {
  let isImage = false;
  let generationId = "";
  let functionalContent = "";

  console.log("All prompts provided:", { prompt1, prompt2, prompt3, prompt4 });

  const loraData = await Lora.findOne({
    productId: productId,
  });
  if (!loraData || !loraData.loraPath || !loraData.tokenName) {
    console.error(`Lora data (loraPath or tokenName) not found for productId:`);
    functionalContent = "Can Not Find Visual Model For This Product";
    return { isImage, generationId, functionalContent };
  }

  const prompt1Result = prompt1.replaceAll(replaceTrigger, loraData.tokenName);
  const prompt2Result = prompt2.replaceAll(replaceTrigger, loraData.tokenName);
  const prompt3Result = prompt3.replaceAll(replaceTrigger, loraData.tokenName);
  const prompt4Result = prompt4.replaceAll(replaceTrigger, loraData.tokenName);

  const allPrompts = [
    prompt1Result,
    // prompt2Result,
    // prompt3Result,
    prompt4Result,
  ];

  const generations = allPrompts.map((promptText) => ({
    prompt: promptText,
    negative_prompt: "",
    num_outputs: 1,
    width: 1024,
    height: 1024,
    num_inference_steps: 30,
    guidance_scale: 4,
    seed: null,
  }));

  const generationPayload = {
    userId: bId,
    lora_url: loraData.loraPath,
    lora_scale: 0.9, // Default value
    productId: productId,
    clientId: userId, // Default value
    isVideo: false,
    generations: generations,
  };

  const visualGenerationResult = await GenerateVisuals(generationPayload);

  if (visualGenerationResult.id) {
    isImage = true;
    generationId = visualGenerationResult.id;
    functionalContent = "Product Images Request Success.";
    return { isImage, generationId, functionalContent };
  } else {
    isImage = false;
    generationId = " ";
    functionalContent = "Error Generating Images...";
    return { isImage, generationId, functionalContent };
  }
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  await connect();

  // --- Destructure all required inputs from the request ---
  const {
    messages,
    productId,
    userId,
    bId,
    productDetails,
    // Add credentials needed for meeting scheduling
    userEmail,
    customerName,
    myEmail,
    clientId,
    clientSecret,
    refreshToken,
    // customer details
    customerDetails,
  } = await req.json();

  console.log("messages:", messages);

  // --- Basic validation for meeting credentials (optional but recommended) ---
  const requiredMeetingCreds = {
    userEmail,
    myEmail,
    clientId,
    clientSecret,
    refreshToken,
  };
  const missingCreds = Object.entries(requiredMeetingCreds)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  const firstName = customerName?.trim().split(/\s+/)[0] || "";
  const replaceTrigger = "r4h6j7h4";

  // Note: We don't fail the entire request if meeting creds are missing,
  // only the meeting scheduling function will fail if called without them.

  try {
    // Define the system prompt
    const systemPrompt = {
      role: "system",
      content: `
        You are a professional sales and marketing representative. You are selling a product with the following details:
        Name: ${productDetails.title}
        Description: ${productDetails.description}
        Price: ${productDetails.price}
        Maximum Discount: ${productDetails.maxDiscountRate}%

        Your bargaining power is ${productDetails.bargainingPower} (0-1). The higher this number, the more resistant you should be to giving discounts.
        Never offer a discount higher than ${productDetails.maxDiscountRate}%. But alway give a discount offer to the user on his first contact.

        When bargaining, use the following guidelines:
        - A lower bargaining power (e.g., 0.1) means you are easily convinced to offer higher discounts.
        - A higher bargaining power (e.g., 0.9) means you are difficult to convince, and you should negotiate firmly.
        - Ensure that any agreed discount is within the allowed range (0 to ${productDetails.maxDiscountRate}%).

        You can also issue invoices for users when requested using the 'issue_invoice' function.
        You can also schedule a Google Meet call if the user asks to talk to someone, requests a meeting, wants human help, or expresses a desire to speak with a representative. Use the 'schedule_meeting' function for this.
        Always give the exact time and date the user request the meeting if the user specifies the date and time of the meeting.

        You also have the capability to generate a prompts for generating a promotional graphic card design and product ads photos for the product using the 'generate_images' function.
        When asked for a visual, images, pictures and the likes you should generate a detailed prompts for this function.
        The prompts should also specify the overall visual style (e.g., colorful, playful, professional, depending on the product), background details, and font style (e.g., eye-catching, whimsical).
        Aim for a descriptive prompts (around 75-100 words for each prompt) that will result in a compelling visual promotion. 
        All the prompts should be different from each other. And all the prompt should contain the product trigger word which is ${replaceTrigger}
        use as many '${replaceTrigger}' as possible in the prompt sice it is the product trigger word.
        Here are 3 good example of a prompts that works perfectly for generating a promotional graphic card design and product ads photos. So use them as an inspiration or template
                Example 1: Prompt for sneakers:
                ${replaceTrigger}, a photo of ${replaceTrigger}, create a bold, vibrant graphic card design featuring Limitless Stride™ Personalized Athletic 
                Sneakers in the foreground with a colorful, dynamic background. Present the sneaker in a prominent, eye-catching 
                angle, surrounded by artistic splashes of color, digital brush strokes, and energy lines. Overlay with playful, 
                modern font text: "15% OFF Just For Ali! Ends May 8, 2025" to make the promotion personal and urgent. 
                Ensure the style is youthful, energetic, and cutting-edge to reflect customization and sportiness.

                Example 2: Prompt for hoodie:
                ${replaceTrigger}, a photo of ${replaceTrigger} styled as a dynamic sportswear ad. Hoodie shown on a virtual athlete in an action pose with 
                swirling blue graphics. Background features a transparent overlay of University of Nairobi landmarks. Bold, impactful 
                font announces: "Special 10% Discount For Abdiladif – Ends 25/5/2025!" Color palette is energetic, mixing blues and blacks

                Example 3: Prompt for kids by bicycle
                ${replaceTrigger}, A vibrant illustration of a ${replaceTrigger} kids bicycle seamlessly integrated into a colorful graphic card design, with a 
                backdrop of stunning gradient colors. A young child, brimming with joy, is shown riding the bicycle, radiating a 
                sense of youthful energy. The scene is bursting with vibrant colors, creating a fun and playful atmosphere. 
                Text overlays in a whimsical, eye-catching font exclaim 'Summer Fun Starts Here!' and '30% OFF Kids' Bikes', 
                further emphasizing the promotional aspect of the image. This whimsical, detailed illustration, uses vivid colors, 
                sharp lines, and a sense of childlike wonder


        Ensure all interactions are professional and helpful, always use the first person plural point of view (e.g., "we").
        Do not reveal the bargaining power or the maximum discount rate to the user. Bargain intelligently based on the power level.
        `,
    };

    // Save the user's last message
    const lastUserMessage = messages[messages.length - 1];
    await ChatMessage.create({
      role: lastUserMessage.role,
      content: lastUserMessage.content,
      productId,
      userId,
      bId,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1", // Or your preferred model supporting function calling
      // model: "unsloth/Llama-3.3-70B-Instruct-bnb-4bit", // Ensure this model supports OpenAI-compatible function calling
      messages: [
        systemPrompt,
        ...messages.map((message: any) => ({
          content: message.content,
          role: message.role,
        })),
      ],
      functions: [
        {
          name: "give_discount",
          description:
            "Agree on a discount rate with the user for the product.",
          parameters: {
            type: "object",
            properties: {
              agreedDiscountRate: {
                type: "number",
                description:
                  "The discount rate percentage agreed with the user (e.g., 10 for 10%). Must be > 0.",
              },
              expiresIn: {
                type: "number",
                description:
                  "The number of days from now when the discount expires. Default is 1 day.",
                default: 1,
              },
            },
            required: ["agreedDiscountRate"], // expiresIn defaults if not provided
          },
        },
        {
          name: "issue_invoice",
          description: "Generate an invoice for the product.",
          parameters: {
            type: "object",
            properties: {
              qty: {
                type: "number",
                description: "Quantity of the product in the invoice.",
                default: 1,
              },
              expiresIn: {
                type: "number",
                description:
                  "The number of days from now when the Invoice expires. Default is 1 day.",
                default: 1,
              },
            },
            required: [], // qty and expiresIn have defaults
          },
        },
        // --- NEW: Schedule Meeting Function Definition ---
        {
          name: "schedule_meeting",
          description:
            "Schedules a Google Meet call when the user requests a meeting or wants to talk to a representative.",
          parameters: {
            type: "object",
            properties: {
              summary: {
                type: "string",
                description: `A brief summary/title for the meeting, related to the product: ${productDetails.title}. Max 50 chars.`,
              },
              description: {
                type: "string",
                description: `A short description for the meeting agenda, based on the conversation context and product description. Max 150 chars. Product Desc: ${productDetails.description}`,
              },
              // Make startTime optional for the LLM. The backend will default if not provided.
              startTime: {
                type: "string",
                description:
                  "The requested start time for the meeting in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). Only include this if the user specifies a particular date and time. Otherwise, omit this property.",
              },
            },
            required: ["summary", "description"], // startTime is now optional here
          },
        },
        // ----- NEW: GENERATE IMAGES --------
        {
          name: "generate_images",
          description:
            "Generate images of the product when the user requests images or any visuals of the product of the product.",
          parameters: {
            type: "object",
            properties: {
              prompt1: {
                type: "string",
                description: `
                A detailed image generation prompt (around 75-100 words) starting.EXACTLY with '${replaceTrigger}, a photo of ${replaceTrigger}', This prompt should describe a vibrant graphic advertisement card design style featuring the product in the foreground and promotional messages in the background
                Crucially, the prompt MUST instruct the image generator to include personalized promotional text. This text should incorporate:
                  - The user's name ${firstName}.
                  - The specific, agreed-upon discount percentage(if known from the conversation history, and always choose the latest discount given ).
                  - Any relevant expiry date for the offer (if applicable and known).
                  - use as many '${replaceTrigger}' as possible in the prompt sice it is the product trigger word.
                For example, if the user 'Sarah' agreed to a 15% discount expiring June 1st, the prompt should specify text like '15% OFF Just For Sarah! Ends June 1st'
                `,
              },
              prompt2: {
                type: "string",
                description: `
                Another detailed image generation prompt different from the others (around 75-100 words) starting.EXACTLY with '${replaceTrigger}, a photo of ${replaceTrigger}', This prompt should describe a vibrant graphic card design style featuring the product in the foreground and promotional messages in the background
                Crucially, the prompt MUST instruct the image generator to include personalized promotional text. This text should incorporate:
                  - The user's name ${firstName}.
                  - The specific, agreed-upon discount percentage(if known from the conversation history).
                  - Any relevant expiry date for the offer (if applicable and known).
                For example, if the user 'Sarah' agreed to a 15% discount expiring June 1st, the prompt should specify text like '15% OFF Just For Sarah! Ends June 1st'`,
              },
              prompt3: {
                type: "string",
                description: `A third detailed image prompt (around 75-100 words), starting EXACTLY with '${replaceTrigger}, a photo of ${replaceTrigger}'. Explore another distinct visual concept.`,
              },
              prompt4: {
                type: "string",
                description: `A fourth detailed image prompt (around 75-100 words), starting EXACTLY with '${replaceTrigger}, a photo of ${replaceTrigger}'. Explore and Offer a final unique and distinct visual concept and angle. 
                First, conceptualize an exciting product for ${replaceTrigger} product, 
                then describe its ideal showcase: a specific, compelling visual environment, for a top-tier product promo advertisement
                use as many '${replaceTrigger}' as possible in the prompt sice it is the product trigger word.`,
              },
            },
            required: [], // qty and expiresIn have defaults
          },
        },
      ],
      function_call: "auto",
    });

    const aiResponse = completion.choices[0].message;

    // --- Handle Function Calls ---
    if (aiResponse.function_call) {
      const { name, arguments: args } = aiResponse.function_call;
      let functionResultContent = ""; // Content to save in chat history
      let responseData = {}; // Data to send back to client
      let isImage2 = false;
      let generationId2 = "";

      try {
        // Add a try-catch around function call handling
        switch (name) {
          case "give_discount": {
            const { agreedDiscountRate, expiresIn = 1 } = JSON.parse(args); // Default expiresIn if missing
            if (
              agreedDiscountRate > 0 &&
              agreedDiscountRate <= productDetails.maxDiscountRate
            ) {
              const discount = await handleDiscount(
                userId,
                bId,
                productId,
                agreedDiscountRate,
                expiresIn,
                customerDetails,
                productDetails
              );
              functionResultContent = `Ok I give you a ${agreedDiscountRate}% discount for ${
                productDetails.title
              }. This offer is valid until ${discount.expiryDate.toLocaleDateString()}. You can apply it at checkout.`;
              responseData = {
                result: functionResultContent,
                discountFunc: true,
                invoiceFunc: false,
                meetingFunc: false,
                imageFunc: false,
              };
            } else {
              console.error(
                `Invalid discount rate requested by LLM: ${agreedDiscountRate}. Max allowed: ${productDetails.maxDiscountRate}`
              );
              functionResultContent = `I apologize, but we can only offer a discount up to ${productDetails.maxDiscountRate}%. Would you like to proceed with that?`;
              // Respond with a message, not an error status, to continue conversation
              responseData = {
                result: functionResultContent,
                discountFunc: false,
                invoiceFunc: false,
                meetingFunc: false,
                imageFunc: false,
              };
            }
            break; // Added break
          }
          case "issue_invoice": {
            const { qty = 1, expiresIn = 1 } = JSON.parse(args); // Default qty and expiresIn
            const invoice = await handleInvoice(
              userId,
              bId,
              productId,
              qty,
              expiresIn,
              customerDetails,
              productDetails
            );
            functionResultContent = `We have prepared an invoice for ${qty} unit(s) of ${
              productDetails.title
            }. It's valid until ${invoice.expiryDate.toLocaleDateString()}. You should receive payment details via email shortly.`;
            responseData = {
              result: functionResultContent,
              discountFunc: false,
              invoiceFunc: true,
              meetingFunc: false,
              imageFunc: false,
            };
            break; // Added break
          }
          // --- NEW: Handle Schedule Meeting Case ---
          case "schedule_meeting": {
            if (missingCreds.length > 0) {
              console.error(
                "Attempted to schedule meeting, but required credentials were missing:",
                missingCreds
              );
              functionResultContent =
                "I can help schedule a meeting, but it seems some configuration is missing on our end. Please contact support directly for assistance.";
              responseData = {
                result: functionResultContent,
                discountFunc: false,
                invoiceFunc: false,
                meetingFunc: false,
                imageFunc: false,
              };
            } else {
              const {
                summary,
                description,
                startTime: requestedStartTime,
              } = JSON.parse(args);
              console.log("startTime: ", requestedStartTime);

              const meetingResult = await handleScheduleMeeting({
                userId,
                bId,
                productId,
                userEmail,
                myEmail,
                summary,
                description,
                requestedStartTime, // Pass the optional start time
                clientId,
                clientSecret,
                refreshToken,
                userDetails: customerDetails,
                productDetails,
              });

              functionResultContent = meetingResult.message; // Use the message from handleScheduleMeeting
              if (meetingResult.success) {
                responseData = {
                  result: functionResultContent,
                  meetingLink: meetingResult.hangoutLink,
                  discountFunc: false,
                  invoiceFunc: false,
                  meetingFunc: true,
                  imageFunc: false,
                };
              } else {
                // Keep the conversation going, inform user of the error
                responseData = {
                  result: functionResultContent,
                  discountFunc: false,
                  invoiceFunc: false,
                  meetingFunc: false,
                  imageFunc: false,
                };
              }
            }
            break; // Added break
          }

          // --- GENERATE IMAGES
          case "generate_images": {
            const { prompt1, prompt2, prompt3, prompt4 } = JSON.parse(args);
            console.log("Product Id:", productId);

            if (prompt1 && prompt2 && prompt3 && prompt4) {
              const { isImage, generationId, functionalContent } =
                await generateImages({
                  prompt1,
                  prompt2,
                  prompt3,
                  prompt4,
                  productId,
                  userId,
                  bId,
                  replaceTrigger,
                });

              isImage2 = isImage;
              generationId2 = generationId;
              // discountFunc: true, invoiceFunc: false, meetingFunc: false, imageFunc:false
              functionResultContent = functionalContent;
              responseData = {
                result: functionResultContent,
                discountFunc: false,
                invoiceFunc: false,
                meetingFunc: false,
                imageFunc: true,
              };
            } else {
              // At least one prompt is missing or falsy
              console.error("Missing one or more prompts");
              responseData = {
                result: "Error: Unable to generate Images",
                discountFunc: false,
                invoiceFunc: false,
                meetingFunc: false,
                imageFunc: false,
              };
            }
            break;
          }
          default:
            console.error("Unknown function call requested by LLM:", name);
            functionResultContent =
              "Sorry, I encountered an unexpected issue. Could you please rephrase your request?";
            responseData = {
              result: functionResultContent,
              discountFunc: false,
              invoiceFunc: false,
              meetingFunc: false,
              imageFunc: false,
            };
          // Consider sending an error response if this happens often
          // responseData = { error: "Unknown function call." };
        }

        // Save the outcome of the function call as the assistant's message
        await ChatMessage.create({
          role: "assistant",
          content: functionResultContent,
          productId,
          userId,
          bId,
          isImage: isImage2,
          generationId: generationId2,
        });

        return NextResponse.json(responseData);
      } catch (error: any) {
        console.error(
          `Error processing function call ${name}: ${error.message}`,
          error
        );
        // Save a generic error message to chat
        const errorMessage =
          "Sorry, something went wrong while trying to process that request. Please try again.";
        await ChatMessage.create({
          role: "assistant",
          content: errorMessage,
          productId,
          userId,
          bId,
        });
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }
    }

    // --- Handle Regular Text Response ---
    if (aiResponse.content) {
      await ChatMessage.create({
        role: aiResponse.role || "assistant", // Ensure role is set
        content: aiResponse.content,
        productId,
        userId,
        bId,
      });
      return NextResponse.json({
        result: aiResponse.content,
        discountFunc: false,
        invoiceFunc: false,
        meetingFunc: false,
        imageFunc: false,
      });
    }

    // Fallback if no content and no function call (should be rare)
    console.error(
      "LLM Function Call response had no content or function call:",
      aiResponse
    );
    return NextResponse.json(
      { error: "Received an empty response from AI." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error(`Error in POST handler: ${error.message}`, error);
    // Check for specific OpenAI errors if needed
    // if (error instanceof OpenAI.APIError) { ... }
    return NextResponse.json(
      { error: "An error occurred during your request." },
      { status: 500 }
    );
  }
}
