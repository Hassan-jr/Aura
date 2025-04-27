import { NextResponse } from "next/server";
import crypto from "crypto";
import mongoose, { Types } from "mongoose"; // Import mongoose and Types
import { connect } from "@/db";
import { Delivery, Webhook } from "@/modals/webhook.modal";

// --- Define an Interface for the Delivery Document ---
// This should match the structure defined in your DeliverySchema
interface IDelivery {
  _id: Types.ObjectId; // Or string if lean() converts it - Mongoose 6+ usually keeps it as ObjectId
  webhookId: Types.ObjectId; // Or string if lean() converts it
  url: string;
  event: string;
  payload: any; // Keep 'any' if the payload structure is variable, or define a specific type
  success: boolean;
  statusCode?: number;
  message?: string;
  timestamp: Date; // Or string if lean() converts it
  createdAt?: Date; // Added by timestamps: true
  updatedAt?: Date; // Added by timestamps: true
  // Add any other fields from your schema if necessary
}

// Define an Interface for the Webhook Document (optional but good practice)
interface IWebhook {
  _id: Types.ObjectId;
  url: string;
  secret: string;
  events: {
    discountSent: boolean;
    invoiceIssued: boolean;
    postGenerated: boolean;
    meetingScheduled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the structure for the route parameters
interface RouteParams {
  id: string;
}

export async function POST(
  request: Request,
  { params }: { params: RouteParams }
) {
  // Ensure connection is established
  await connect();

  const deliveryData = await request.json();

  try {
    // --- 1. Find the Original Delivery Record ---

    // Apply type to webhook query as well
    const webhook = await Webhook.findById(
      deliveryData.webhookId
    ).lean<IWebhook>();

    if (!webhook) {
      // This might indicate a data integrity issue if a delivery exists but its webhook doesn't
      console.error(
        `Webhook not found for ID: ${deliveryData.webhookId}, referenced by`
      );
      return NextResponse.json(
        { message: "Associated webhook configuration not found" },
        { status: 404 }
      );
    }

    // --- 3. Generate Signature ---
    // Ensure payload exists and is stringifiable, and secret exists
    if (!deliveryData.payload || typeof webhook.secret !== "string") {
      console.error("Missing payload or secret for signature generation.", {
        webhookId: webhook._id,
      });
      return NextResponse.json(
        { message: "Cannot generate signature due to missing data" },
        { status: 500 }
      );
    }

    let payloadString: string;
    try {
      // Ensure payload is stringified correctly
      payloadString = JSON.stringify(deliveryData.payload);
    } catch (stringifyError) {
      console.error(
        "Error stringifying payload for signature:",
        stringifyError
      );
      return NextResponse.json(
        { message: "Failed to process payload for signature" },
        { status: 500 }
      );
    }


    const key = crypto
      .createHash("sha256")
      .update(webhook.secret, "utf8")
      .digest();
      
    // 3. Encrypt with AES-256-CBC
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([
      cipher.update(payloadString, "utf8"),
      cipher.final(),
    ]);

    // 4. Prefix IV to ciphertext and convert to hex
    const messageHex = Buffer.concat([iv, encrypted]).toString("hex");

    // --- 4. Attempt to Send the Webhook ---
    let success = false;
    let statusCode: number | undefined = undefined; // Initialize as undefined
    let responseMessage = ""; // Renamed from 'message' to avoid conflict

    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //   "X-Webhook-Signature-256": `sha256=${signature}`, // Common practice prefix
          // Consider adding a User-Agent header
          // "User-Agent": "YourAppName-Webhook/1.0"
        },
        body: messageHex, // Use the stringified payload
        // Add a timeout?
        // signal: AbortSignal.timeout(10000) // e.g., 10 seconds timeout
      });

      statusCode = response.status;
      success = response.ok; // ok is true for status codes 200-299
      // Try to get a more informative message from the response if possible
      responseMessage = success
        ? `Webhook resent successfully (Status: ${statusCode})`
        : `Webhook resend failed (Status: ${statusCode})`;
    } catch (fetchError: unknown) {
      // Handle fetch-specific errors (network issues, DNS errors, timeouts)
      console.error(`Error sending webhook to ${webhook.url}:`, fetchError);
      success = false;
      statusCode = undefined; // No status code available if fetch itself failed
      responseMessage =
        fetchError instanceof Error
          ? `Network error: ${fetchError.message}`
          : "Network error: Unknown failure";
    }

    // --- 5. Create New Delivery Record for the Resend Attempt ---
    const newDeliveryData = {
      // Ensure webhookId is an ObjectId when saving back to the DB
      // The 'webhook' object already has _id as an ObjectId from the lean<IWebhook>() query
      webhookId: webhook._id,
      url: webhook.url,
      event: deliveryData.event, // Resending the same event type
      payload: deliveryData.payload, // Resending the same payload
      success,
      statusCode, // Will be undefined if fetch failed
      message: responseMessage, // Use the detailed message from fetch attempt
      timestamp: new Date(), // Record the time of *this* resend attempt
      // Mongoose adds createdAt/updatedAt automatically via timestamps: true
    };

    // Use the Delivery model to create the new record in the 'deliveries' collection
    const createdDelivery = await Delivery.create(newDeliveryData);

    // --- 6. Return the Newly Created Delivery Record ---
    // The createdDelivery object is a Mongoose document.
    // NextResponse.json can serialize it directly.
    // Using .toObject() provides a plain JS object, stripping Mongoose methods/virtuals if not needed.
    // Add generic type <IDelivery> to toObject() for better type safety on the returned object if needed elsewhere.
    return NextResponse.json(createdDelivery.toObject());
  } catch (error: unknown) {
    console.error(
      `Error processing webhook send for ID ${deliveryData.webhookId}:`,
      error
    );
    // Provide a more generic error message to the client
    return NextResponse.json(
      {
        message: "Failed to resend webhook due to an internal error",
        error: error instanceof Error ? error.message : "Unknown error",
      }, // Optionally include specific error in dev
      { status: 500 }
    );
  }
}
