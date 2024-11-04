import { NextResponse } from "next/server";
import User from "@/modals/user.modal";
import { connect } from "@/db";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    await connect();

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "An error occurred during email verification" }, { status: 500 });
  }
}