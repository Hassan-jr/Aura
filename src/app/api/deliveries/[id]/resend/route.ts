// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import mongoose, { Types } from "mongoose"; // Import mongoose and Types
// import { connect } from "@/db";
// import { Delivery, Webhook } from "@/modals/webhook.modal";

// // --- Define an Interface for the Delivery Document ---
// // This should match the structure defined in your DeliverySchema
// interface IDelivery {
//   _id: Types.ObjectId; // Or string if lean() converts it - Mongoose 6+ usually keeps it as ObjectId
//   webhookId: Types.ObjectId; // Or string if lean() converts it
//   url: string;
//   event: string;
//   payload: any; // Keep 'any' if the payload structure is variable, or define a specific type
//   success: boolean;
//   statusCode?: number;
//   message?: string;
//   timestamp: Date; // Or string if lean() converts it
//   createdAt?: Date; // Added by timestamps: true
//   updatedAt?: Date; // Added by timestamps: true
//   // Add any other fields from your schema if necessary
// }

// // Define an Interface for the Webhook Document (optional but good practice)
// interface IWebhook {
//   _id: Types.ObjectId;
//   url: string;
//   secret: string;
//   events: {
//     discountSent: boolean;
//     invoiceIssued: boolean;
//     postGenerated: boolean;
//     meetingScheduled: boolean;
//   };
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// // Define the structure for the route parameters

// export async function POST(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const id = (await params).id;

//   // Ensure connection is established
//   await connect();

//   // Validate if the provided ID is a valid MongoDB ObjectId
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return NextResponse.json(
//       { message: "Invalid Delivery ID format" },
//       { status: 400 }
//     );
//   }

//   try {
//     // --- 1. Find the Original Delivery Record ---
//     const originalDelivery = await Delivery.findById(id); // Apply the type here

//     if (!originalDelivery) {
//       return NextResponse.json(
//         { message: "Original delivery record not found" },
//         { status: 404 }
//       );
//     }

//     // --- 2. Find the Associated Webhook ---
//     if (
//       !mongoose.Types.ObjectId.isValid(originalDelivery.webhookId.toString())
//     ) {
//       console.error(
//         "Invalid webhookId stored in delivery record:",
//         originalDelivery.webhookId
//       );
//       return NextResponse.json(
//         { message: "Invalid associated Webhook ID format in delivery record" },
//         { status: 500 }
//       );
//     }

//     // Apply type to webhook query as well
//     const webhook = await Webhook.findById(originalDelivery.webhookId);

//     if (!webhook) {
//       // This might indicate a data integrity issue if a delivery exists but its webhook doesn't
//       console.error(
//         `Webhook not found for ID: ${originalDelivery.webhookId}, referenced by Delivery ID: ${id}`
//       );
//       return NextResponse.json(
//         { message: "Associated webhook configuration not found" },
//         { status: 404 }
//       );
//     }

//     // --- 3. Generate Signature ---
//     if (!originalDelivery.payload || typeof webhook.secret !== "string") {
//       console.error("Missing payload or secret for signature generation.", {
//         deliveryId: id,
//         webhookId: webhook._id,
//       });
//       return NextResponse.json(
//         { message: "Cannot generate signature due to missing data" },
//         { status: 500 }
//       );
//     }

//     let payloadString: string;
//     try {
//       // Ensure payload is stringified correctly
//       payloadString = JSON.stringify(originalDelivery.payload);
//     } catch (stringifyError) {
//       console.error(
//         "Error stringifying payload for signature:",
//         stringifyError
//       );
//       return NextResponse.json(
//         { message: "Failed to process payload for signature" },
//         { status: 500 }
//       );
//     }

//     const key = crypto
//       .createHash("sha256")
//       .update(webhook.secret, "utf8")
//       .digest();

//     // 3. Encrypt with AES-256-CBC
//     const iv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
//     const encrypted = Buffer.concat([
//       cipher.update(payloadString, "utf8"),
//       cipher.final(),
//     ]);

//     // 4. Prefix IV to ciphertext and convert to hex
//     const messageHex = Buffer.concat([iv, encrypted]).toString("hex");

//     // --- 4. Attempt to Send the Webhook ---
//     let success = false;
//     let statusCode: number | undefined = undefined; // Initialize as undefined
//     let responseMessage = ""; // Renamed from 'message' to avoid conflict

//     try {
//       const response = await fetch(webhook.url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: messageHex,
//       });

//       statusCode = response.status;
//       success = response.ok; // ok is true for status codes 200-299
//       // Try to get a more informative message from the response if possible
//       responseMessage = success
//         ? `Webhook resent successfully (Status: ${statusCode})`
//         : `Webhook resend failed (Status: ${statusCode})`;
//     } catch (fetchError) {
//       console.error(`Error sending webhook to ${webhook.url}:`, fetchError);
//       success = false;
//       statusCode = undefined; // No status code available if fetch itself failed
//       responseMessage = fetchError
//         ? `Network error: ${fetchError.message}`
//         : "Network error: Unknown failure";
//     }

//     // --- 5. Create New Delivery Record for the Resend Attempt ---
//     const newDeliveryData = {
//       // Ensure webhookId is an ObjectId when saving back to the DB
//       // The 'webhook' object already has _id as an ObjectId from the lean<IWebhook>() query
//       webhookId: webhook._id,
//       url: webhook.url,
//       event: originalDelivery.event, // Resending the same event type
//       payload: originalDelivery.payload, // Resending the same payload
//       success,
//       statusCode, // Will be undefined if fetch failed
//       message: responseMessage, // Use the detailed message from fetch attempt
//       timestamp: new Date(), // Record the time of *this* resend attempt
//       // Mongoose adds createdAt/updatedAt automatically via timestamps: true
//     };

//     // Use the Delivery model to create the new record in the 'deliveries' collection
//     const createdDelivery = await Delivery.create(newDeliveryData);

//     // --- 6. Return the Newly Created Delivery Record ---
//     // The createdDelivery object is a Mongoose document.
//     // NextResponse.json can serialize it directly.
//     // Using .toObject() provides a plain JS object, stripping Mongoose methods/virtuals if not needed.
//     // Add generic type <IDelivery> to toObject() for better type safety on the returned object if needed elsewhere.
//     return NextResponse.json(createdDelivery.toObject());
//   } catch (error: unknown) {
//     console.error(`Error processing webhook resend for ID ${id}:`, error);
//     // Provide a more generic error message to the client
//     return NextResponse.json(
//       {
//         message: "Failed to resend webhook due to an internal error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       }, // Optionally include specific error in dev
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import mongoose, { Types } from "mongoose";
import { connect } from "@/db";
import { Delivery, Webhook } from "@/modals/webhook.modal";

// Interfaces
interface IDelivery {
  _id: Types.ObjectId;
  webhookId: Types.ObjectId;
  url: string;
  event: string;
  payload: any;
  success: boolean;
  statusCode?: number;
  message?: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // keep params as Promise
) {
  const { id } = await params;

  await connect();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid Delivery ID format" },
      { status: 400 }
    );
  }

  try {
    const originalDelivery = await Delivery.findById(id);
    if (!originalDelivery) {
      return NextResponse.json({ message: "Original delivery record not found" }, { status: 404 });
    }

    if (!mongoose.Types.ObjectId.isValid(originalDelivery.webhookId.toString())) {
      console.error("Invalid webhookId stored in delivery record:", originalDelivery.webhookId);
      return NextResponse.json({ message: "Invalid associated Webhook ID format in delivery record" }, { status: 500 });
    }

    const webhook = await Webhook.findById(originalDelivery.webhookId);
    if (!webhook) {
      console.error(`Webhook not found for ID: ${originalDelivery.webhookId}`);
      return NextResponse.json({ message: "Associated webhook configuration not found" }, { status: 404 });
    }

    if (!originalDelivery.payload || typeof webhook.secret !== "string") {
      console.error("Missing payload or secret for signature generation.", { deliveryId: id, webhookId: webhook._id });
      return NextResponse.json({ message: "Cannot generate signature due to missing data" }, { status: 500 });
    }

    let payloadString: string;
    try {
      payloadString = JSON.stringify(originalDelivery.payload);
    } catch (err) {
      console.error("Error stringifying payload:", err);
      return NextResponse.json({ message: "Failed to process payload for signature" }, { status: 500 });
    }

    const key = crypto.createHash("sha256").update(webhook.secret, "utf8").digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([cipher.update(payloadString, "utf8"), cipher.final()]);
    const messageHex = Buffer.concat([iv, encrypted]).toString("hex");

    let success = false;
    let statusCode: number | undefined;
    let responseMessage = "";
    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: messageHex,
      });
      statusCode = response.status;
      success = response.ok;
      responseMessage = success
        ? `Webhook resent successfully (Status: ${statusCode})`
        : `Webhook resend failed (Status: ${statusCode})`;
    } catch (err) {
      console.error(`Error sending webhook to ${webhook.url}:`, err);
      responseMessage = err instanceof Error ? `Network error: ${err.message}` : "Network error: Unknown failure";
    }

    const newDeliveryData = {
      webhookId: webhook._id,
      url: webhook.url,
      event: originalDelivery.event,
      payload: originalDelivery.payload,
      success,
      statusCode,
      message: responseMessage,
      timestamp: new Date(),
    };
    const createdDelivery = await Delivery.create(newDeliveryData);

    return NextResponse.json(createdDelivery.toObject());
  } catch (err: unknown) {
    console.error(`Error processing webhook resend for ID ${id}:`, err);
    return NextResponse.json(
      {
        message: "Failed to resend webhook due to an internal error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
