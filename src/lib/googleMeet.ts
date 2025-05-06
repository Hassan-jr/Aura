// lib/googleMeet.ts
import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// Define the structure for input parameters
export interface ScheduleMeetParams {
  summary: string; // Event title
  description?: string; // Event description
  startTime: string; // ISO 8601 format (e.g., "2025-05-15T09:00:00-07:00")
  endTime: string; // ISO 8601 format (e.g., "2025-05-15T10:00:00-07:00")
  attendees?: string[]; // Array of attendee email addresses
  timeZone: string; // IANA Time Zone Database name (e.g., "America/Los_Angeles", "Africa/Nairobi")
  userId: string;
  bid: string;
  productId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

// Define the structure for the returned data
export interface ScheduledMeetData {
  googleEventId: string;
  meetLink: string;
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  attendees?: { email: string }[];
  creator: { email?: string | null; self?: boolean | null };
  organizer: { email?: string | null; self?: boolean | null };
  htmlLink: string; // Link to the event in Google Calendar UI
  userId: string;
  bid: string;
  productId: string;
}

export async function scheduleGoogleMeet(
  params: ScheduleMeetParams
): Promise<ScheduledMeetData> {
  try {
    // 1. Load Credentials from Environment Variables
    const clientId = params.clientId;
    const clientSecret = params.clientSecret;
    const refreshToken = params.refreshToken; // Crucial!

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error(
        "Missing Google API credentials or refresh token in environment variables."
      );
    }

    // 2. Create OAuth2 Client
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret
      // Optional redirect URI if you need it for the initial auth flow
      // process.env.GOOGLE_REDIRECT_URI
    );

    // 3. Set Refresh Token
    // This allows the client to automatically get new access tokens
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    // 4. Create Google Calendar API Client
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // 5. Construct Event Resource
    const event: calendar_v3.Schema$Event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startTime,
        timeZone: params.timeZone,
      },
      end: {
        dateTime: params.endTime,
        timeZone: params.timeZone,
      },
      attendees: params.attendees?.map((email) => ({ email })),
      // Crucial for creating a Google Meet link
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}`, // Unique ID for the request
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      // Optional: Add reminders, etc.
      // reminders: {
      //   useDefault: false,
      //   overrides: [
      //     { method: 'email', minutes: 24 * 60 },
      //     { method: 'popup', minutes: 10 },
      //   ],
      // },
    };

    // 6. Insert Event into Calendar
    // 'primary' refers to the primary calendar of the user associated with the refresh token
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1, // Required when creating conference data
      sendNotifications: true, // Send invitations to attendees
    });

    // 7. Extract and Return Relevant Data
    const createdEvent = response.data;

    if (
      !createdEvent.id ||
      !createdEvent.hangoutLink ||
      !createdEvent.htmlLink
    ) {
      console.error(
        "Google Calendar API response missing expected fields:",
        createdEvent
      );
      throw new Error(
        "Failed to create Google Meet link or retrieve event details."
      );
    }

    let finalAttendees: { email: string }[]; // Declare variable with the target type

    if (createdEvent.attendees) {
      // If the API response includes attendees:
      finalAttendees = createdEvent.attendees
        .map((attendee) => attendee.email) // Extract the email (might be null/undefined)
        .filter(
          (email): email is string =>
            typeof email === "string" && email.length > 0
        ) // Filter out null/undefined/empty emails (type guard 'email is string' helps TS)
        .map((email) => ({ email })); // Map the valid email strings back to objects matching your type
    } else {
      // If the API response doesn't have attendees, use the input params as fallback
      finalAttendees = params.attendees?.map((email) => ({ email })) ?? []; // Default to empty array if params.attendees is also null/undefined
    }

    const scheduledData: ScheduledMeetData = {
      googleEventId: createdEvent.id,
      meetLink: createdEvent.hangoutLink,
      summary: createdEvent.summary ?? params.summary, // Use original if summary is missing in response
      description: createdEvent.description ?? params.description,
      startTime: createdEvent.start?.dateTime ?? params.startTime,
      endTime: createdEvent.end?.dateTime ?? params.endTime,
      timeZone: createdEvent.start?.timeZone ?? params.timeZone,
      attendees: finalAttendees,
      creator: createdEvent.creator ?? { email: null, self: null },
      organizer: createdEvent.organizer ?? { email: null, self: null },
      htmlLink: createdEvent.htmlLink,
      userId: params.userId,
      bid: params.bid,
      productId: params.productId,
    };

    console.log("Google Meet event created:", scheduledData.meetLink);
    return scheduledData;
  } catch (error: any) {
    console.error("Error scheduling Google Meet:", error);
    // Check for specific Google API errors
    if (error.response?.data?.error) {
      console.error("Google API Error Details:", error.response.data.error);
      throw new Error(
        `Google Calendar API Error: ${
          error.response.data.error.message || "Unknown error"
        }`
      );
    }
    // Rethrow a generic error or a more specific one based on the caught error
    throw new Error(`Failed to schedule Google Meet: ${error.message}`);
  }
}
