"use server";

import { connect } from "@/db";
import { Calender } from "@/modals/calender.modal";

export async function addcalender(data: {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REFRESH_TOKEN: string;
  userId: String;
}) {
  try {
    await connect();
    const calender = new Calender(data);
    await calender.save();
    return { success: true, message: "calender added successfully" };
  } catch (error) {
    console.error("Failed to add calender:", error);
    return { success: false, message: "Failed to add calender" };
  }
}

export async function getAllCalenders(userId: string) {
  try {
    await connect();
    // ensure valid ObjectId

    const calendars = await Calender.find({ userId }).lean();

    return JSON.parse(
      JSON.stringify(
        calendars.map((doc) => ({
          ...doc,
          _id: doc._id.toString(),
          createdAt: doc.createdAt?.toLocaleString(),
          updatedAt: doc.updatedAt?.toLocaleString(),
        }))
      )
    );
  } catch (error) {
    console.error("Failed to fetch calendars:", error);
    throw error;
    //   return { success: false, message: "Failed to fetch calendars" };
  }
}

export async function updateCalendar(
  data: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REFRESH_TOKEN: string;
    userId: String;
  },
  calendarId: string
) {
  try {
    await connect();

    const updated = await Calender.findByIdAndUpdate(
      calendarId,
      { $set: data },
      { new: true }
    );
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update calendar:", error);
    // return { success: false, message: "Failed to update calendar" };
    throw error;
  }
}
