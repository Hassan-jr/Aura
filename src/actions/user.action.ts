"use server";

import User from "@/modals/user.modal";
import { connect } from "@/db";
import bcrypt from "bcryptjs";

export async function createUser(user: any) {
  try {
    await connect();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(id, userData) {
  try {
    await connect();
    const newUser = await User.findByIdAndUpdate(
      id,
      { $set: { ...userData } },
      { new: true }
    );
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}

export async function updatePassword(
  userId,
  currentPassword,
  newPassword,
  confirmPassword
) {
  // 2. Validate new/confirm match
  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirmation do not match.");
  }

  // 3. Connect to DB & fetch user record
  await connect();
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  // 4. Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new Error("Current password is incorrect.");
  }

  // 5. Hash & update
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  // 6. Done
  return { success: true };
}
