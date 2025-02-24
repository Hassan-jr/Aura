import { NextResponse } from "next/server";
import User from "@/modals/user.modal";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";
import {connect} from "@/db"

export async function POST(req: Request) {
  try {
    await connect();
    const { name, email, username, password, accountType } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      accountType: accountType,
      profileUrl: "",
      isGmail: false,
      emailVerified: true,
      verificationToken,
      verificationTokenExpiry,
    });

    // Send verification email
    // await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
  }
}