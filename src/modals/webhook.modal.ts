import mongoose from "mongoose";

// --- Webhook Schema ---

const WebhookSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Webhook URL is required"],
      // You might want to add validation for URL format here if needed
    },
    secret: {
      type: String,
      required: [true, "Webhook secret is required"],
      // Consider adding select: false if you don't want to fetch the secret by default
      // select: false,
    },
    bId: {
      type: String,
      required: true,
    },
    events: {
      // Nested object for event subscriptions
      type: {
        discountSent: {
          type: Boolean,
          default: false,
        },
        invoiceIssued: {
          type: Boolean,
          default: false,
        },
        postGenerated: {
          type: Boolean,
          default: false,
        },
        meetingScheduled: {
          type: Boolean,
          default: false,
        },
      },
      // Provide a default empty object or set defaults for individual booleans as above
      default: () => ({ // Use a function for default objects
        discountSent: false,
        invoiceIssued: false,
        postGenerated: false,
        meetingScheduled: false,
      }),
      // You might want to add a validation to ensure at least one event is true
    },
    // The `createdAt` field is automatically handled by `timestamps: true` below
    // The interface has `createdAt: string`, but storing as Date is standard in MongoDB
    // Mongoose handles the conversion.
  },
  {
    // Adds `createdAt` and `updatedAt` fields automatically (as Date types)
    timestamps: true,
  }
);

// Export the Webhook model using the Next.js pattern to prevent recompilation issues
export const Webhook =
  mongoose.models.Webhook || mongoose.model("Webhook", WebhookSchema);


// --- Delivery Schema ---

// Define the possible event types based on the Webhook schema
const deliveryEventTypes = [
    'discountSent',
    'invoiceIssued',
    'postGenerated',
    'meetingScheduled'
];

const DeliverySchema = new mongoose.Schema(
  {
    webhookId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to a Webhook document
      ref: "Webhook", // Links to the 'Webhook' model
      required: [true, "Webhook ID is required"],
    },
    url: {
      type: String,
      required: [true, "Delivery target URL is required"], // The URL the webhook was sent to
    },
    event: {
      type: String,
      required: [true, "Event type is required"]
    },
    payload: {
      type: mongoose.Schema.Types.Mixed, // Allows storing any JSON-like structure
      required: [true, "Payload is required"],
    },
    success: {
      type: Boolean,
      required: [true, "Success status is required"], // Indicates if the webhook delivery was successful (e.g., received a 2xx response)
    },
    statusCode: {
      type: Number, // HTTP status code received from the target URL
      // Not required as per the interface (statusCode?)
    },
    message: {
      type: String, // Optional message, e.g., error details from the target or success confirmation
      // Not required as per the interface (message?)
    },
    timestamp: {
      type: Date, // Represents the time the delivery attempt was made
      required: [true, "Delivery timestamp is required"],
      // The interface shows `string`, but Date is appropriate for storage.
      // Consider adding `default: Date.now` if it should default to creation time,
      // although it usually represents the actual delivery attempt time.
    },
    // `createdAt` and `updatedAt` will be added by timestamps: true
    // These represent when the Delivery *record* was created/updated in *your* DB.
  },
  {
    timestamps: true,
  }
);

// Export the Delivery model
export const Delivery =
  mongoose.models.Delivery || mongoose.model("Delivery", DeliverySchema);