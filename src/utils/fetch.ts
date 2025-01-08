"use server";
import { connect } from "@/db";
import { Feedback } from "@/modals/feedback.modal";
import UserModel from "@/modals/user.modal";
import { Product } from "@/modals/product.modal";
import mongoose from "mongoose";

export async function getProducts() {
  try {
    await connect();
    const products = await Product.find().sort({ createdAt: -1 });
    return products;
  } catch (error) {
    console.log("Product Fetch Error:", error);
  } 
  // finally {
  //   await mongoose.disconnect();
  // }
}

export async function getFeedbacks() {
  // try {
  await connect();
  const feedback = await Feedback.find().sort({ createdAt: -1 });
  return feedback;
  // } catch (error) {
  //   console.log("Feedback Fetch Error:", error);
  // } finally {
  //   await mongoose.disconnect();
  // }
}

export async function getUsers() {
  try {
    await connect();
    const users = await UserModel.find().sort({ createdAt: -1 });
    return users;
  } catch (error) {
    console.log("Users Fetch Error:", error);
  } 
  // finally {
  //   await mongoose.disconnect();
  // }
}
