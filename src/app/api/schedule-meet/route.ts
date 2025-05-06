// app/api/schedule-meet/route.ts
import { NextResponse } from "next/server";
import {
  ScheduleMeetParams,
  scheduleGoogleMeet,
  ScheduledMeetData,
} from "@/lib/googleMeet"; // Adjust path
import MeetEvent from "@/modals/meet.modal"; // Adjust path
import { connect } from "@/db";

// Define the expected request body structure
interface ScheduleRequest {
  userEmail: string; // The email of the app user requesting the meeting
  summary: string;
  description?: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  timeZone: string; // IANA Time Zone
  //   others
  userId: string;
  bid: string;
  productId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;

  myEmail: string;
}

export async function POST(request: Request) {
  try {
    // 1. Get Your Email and Validate Request Body

    const {
      userEmail,
      summary,
      description,
      startTime,
      endTime,
      timeZone,
      myEmail,
      userId,
      bid,
      productId,
      clientId,
      clientSecret,
      refreshToken,
    }: ScheduleRequest = await request.json();

    if (!myEmail) {
      console.error(
        "MY_GOOGLE_MEET_EMAIL is not set in environment variables."
      );
      return NextResponse.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    // Basic validation
    if (!userEmail || !summary || !startTime || !endTime || !timeZone) {
      return NextResponse.json(
        {
          message:
            "Missing required meeting parameters (userEmail, summary, startTime, endTime, timeZone).",
        },
        { status: 400 }
      );
    }
    // Optional: Add email format validation for userEmail

    // 2. Prepare Parameters for the Scheduling Function
    const params: ScheduleMeetParams = {
      summary: summary,
      description: description,
      startTime: startTime,
      endTime: endTime,
      timeZone: timeZone,
      // ---- KEY CHANGE: Set attendees to be you and the user ----
      attendees: [userEmail, myEmail],
      // ---------------------------------------------------------
      userId,
      bid,
      productId,
      clientId,
      clientSecret,
      refreshToken,
    };

    // 3. Schedule the Google Meet Event (using the existing function)
    console.log(`Scheduling meet between ${myEmail} and ${userEmail}`);
    const scheduledData: ScheduledMeetData = await scheduleGoogleMeet(params);

    // 4. Connect to Database
    await connect();

    // 5. Save Data to MongoDB using Mongoose
    const newMeetEvent = new MeetEvent({
      ...scheduledData,
      // Ensure attendees array reflects who was invited
      attendees:
        scheduledData.attendees ||
        params.attendees?.map((email) => ({ email })),
      // You might want to store which user initiated this
      requestingUserEmail: userEmail,
      // userId: 'someUserId', // If you have user IDs
      createdAt: new Date(),
    });
    await newMeetEvent.save();

    // 6. Send Success Response
    return NextResponse.json(
      {
        message: "Google Meet scheduled and saved successfully!",
        eventData: scheduledData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Route Error:", error);
    const errorMessage = error.message || "Internal Server Error";
    const statusCode = error.message?.includes("Google Calendar API Error")
      ? 502
      : 500;
    return NextResponse.json(
      { message: `Failed to schedule meet: ${errorMessage}` },
      { status: statusCode }
    );
  }
}
