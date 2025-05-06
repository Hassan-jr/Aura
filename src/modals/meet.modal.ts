// models/MeetEvent.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface matching the structure of ScheduledMeetData plus any extra fields
export interface IMeetEvent extends Document {
  googleEventId: string;
  meetLink: string;
  summary: string;
  description?: string;
  startTime: string; // Store as string (ISO format) or Date
  endTime: string; // Store as string (ISO format) or Date
  timeZone: string;
  attendees?: { email: string }[];
  creator: { email?: string | null; self?: boolean | null };
  organizer: { email?: string | null; self?: boolean | null };
  htmlLink: string;
  userId: string;
  bid: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeetEventSchema: Schema<IMeetEvent> = new Schema(
  {
    googleEventId: { type: String, required: true, unique: true, index: true },
    meetLink: { type: String, required: true },
    summary: { type: String, required: true },
    description: { type: String },
    startTime: { type: String, required: true }, // Or use Date type: { type: Date, required: true }
    endTime: { type: String, required: true },   // Or use Date type: { type: Date, required: true }
    timeZone: { type: String, required: true },
    attendees: [{ _id: false, email: String }], // Store attendee emails
    creator: { _id: false, email: String, self: Boolean },
    organizer: { _id: false, email: String, self: Boolean },
    htmlLink: { type: String, required: true },
    userId: { type: String, required: true },
    bid: { type: String, required: true },
    productId: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent model recompilation errors in Next.js dev environment
const MeetEvent: Model<IMeetEvent> =
  mongoose.models.MeetEvent || mongoose.model<IMeetEvent>('MeetEvent', MeetEventSchema);

export default MeetEvent;