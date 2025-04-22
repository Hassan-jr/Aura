import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connect } from "@/db";
import { ChatMessage } from "@/modals/chatMessage.modal";

// Add new models for discounts and invoices
import { Discount } from "@/modals/discount.modal";
import { Invoice } from "@/modals/invoice.modal";
import { sendDiscountEmail, sendInvoiceEmail } from "@/lib/email";

// runpod
const OPENAI_BASE_URL = "https://api.runpod.ai/v2/rbcnd8mh4k6vae/openai/v1";
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_RUNPOD_API_KEY;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  //apiKey: OPENAI_API_KEY,
  //baseURL: OPENAI_BASE_URL,
});

// Function to handle "giving discounts"
async function handleDiscount(
  userId: string,
  bId: string,
  productId: string,
  agreedDiscountRate: number,
  expiresIn: number
) {
  const currentDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiresIn);

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
    await sendDiscountEmail(userId, agreedDiscountRate, productId, expiryDate);
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
    return newDiscount;
  }
}

// Function to handle "issuing invoices"
async function handleInvoice(
  userId: string,
  bId: string,
  productId: string,
  qty: number = 1,
  expiresIn: number
) {
  const currentDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiresIn);

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
    return invoice;
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

  const { messages, productId, userId, bId, productDetails } = await req.json();

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
        Never offer a discount higher than ${productDetails.maxDiscountRate}%.

        When bargaining, use the following guidelines:
        - A lower bargaining power (e.g., 0.1) means you are easily convinced to offer higher discounts.
        - A higher bargaining power (e.g., 0.9) means you are difficult to convince, and you should negotiate firmly.
        - Ensure that any agreed discount is within the allowed range (0 to ${productDetails.maxDiscountRate}%).

        You can also issue invoices for users when requested. Ensure all interactions are professional and helpful, always use firt person point of view in plural like "we" e.t.c
        Also note that you are not supposed to share or tell the user/customer what the bargaining power is or what the maximum discount allowed is. Always bargain with them intellegentily
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
      model: "gpt-4-0613", // Use GPT-4 with function calling
      //model: "unsloth/Llama-3.3-70B-Instruct-bnb-4bit",
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
          description: "Agree on a discount rate with the user",
          parameters: {
            type: "object",
            properties: {
              agreedDiscountRate: {
                type: "number",
                description: "The discount rate agreed with the user (0-100)",
              },
              expiresIn: {
                type: "number",
                description:
                  "The number of days from now when the discount expires, by defual these should be 1.",
              },
            },
            required: ["agreedDiscountRate", "expiresIn"],
          },
        },
        {
          name: "issue_invoice",
          description: "Generate an invoice for the product",
          parameters: {
            type: "object",
            properties: {
              qty: {
                type: "number",
                description: "Quantity of the product in the invoice",
                default: 1,
              },
              expiresIn: {
                type: "number",
                description:
                  "The number of days from now when the Invoice expires, by defual these should be 1.",
              },
            },
            required: ["qty", "expiresIn"],
          },
        },
      ],
      function_call: "auto",
    });

    const aiResponse = completion.choices[0].message;

    if (aiResponse.function_call) {
      const { name, arguments: args } = aiResponse.function_call;

      switch (name) {
        case "give_discount": {
          const { agreedDiscountRate, expiresIn } = JSON.parse(args);
          if (
            agreedDiscountRate <= productDetails.maxDiscountRate &&
            agreedDiscountRate > 0
          ) {
            const discount = await handleDiscount(
              userId,
              bId,
              productId,
              agreedDiscountRate,
              expiresIn
            );

            await ChatMessage.create({
              role: "assistant",
              content: `Discount of ${agreedDiscountRate}% granted. Discount expires on ${discount.expiryDate}`,
              productId,
              userId,
              bId,
            });
            return NextResponse.json({
              result: `Discount of ${agreedDiscountRate}% granted. Discount expires on ${discount.expiryDate}`,
            });
          } else {
            return NextResponse.json({
              error: `Invalid discount rate. Must be between 0 and ${productDetails.maxDiscountRate}.`,
            });
          }
        }
        case "issue_invoice": {
          const { qty, expiresIn } = JSON.parse(args);
          const invoice = await handleInvoice(
            userId,
            bId,
            productId,
            qty,
            expiresIn
          );

          await ChatMessage.create({
            role: "assistant",
            content: `Invoice issued for ${qty} items. Invoice expires on ${invoice.expiryDate}`,
            productId,
            userId,
            bId,
          });
          return NextResponse.json({
            result: `Invoice issued for ${qty} items. Invoice expires on ${invoice.expiryDate}`,
          });
        }
        default:
          return NextResponse.json({ error: "Unknown function call." });
      }
    }

    if (aiResponse.content) {
      await ChatMessage.create({
        role: aiResponse.role,
        content: aiResponse.content,
        productId,
        userId,
        bId,
      });
    }

    return NextResponse.json({ result: aiResponse.content });
  } catch (error: any) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    return NextResponse.json(
      { error: "An error occurred during your request." },
      { status: 500 }
    );
  }
}
