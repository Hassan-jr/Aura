"use server";

import { EmailCredentialsModel } from "@/modals/email.modal";
import { connect } from "@/db";

export async function saveEmailCredentials(EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, userId) {
  try {

    if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD || !userId) {
      throw new Error("Missing required fields");
    }
    await connect();

    const credentials = new EmailCredentialsModel({
      EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD,
      userId,
    });

    await credentials.save();

    return { success: true };
  } catch (error) {
    console.error("Failed to save email credentials:", error);
    return { success: false, error: "Failed to save email credentials" };
  }
}
