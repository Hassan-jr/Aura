import { connect } from "@/db";
import { Feedback } from "@/modals/feedback.modal";
import UserModel from "@/modals/user.modal";
import { Product } from "@/modals/product.modal";

export async function getProducts() {
  await connect();
  const products = await Product.find().sort({ createdAt: -1 });
  return products;
}

export async function getFeedbacks() {
    await connect();
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    return feedback;
  }

export async function getUsers() {
  await connect();
  const users = await UserModel.find().sort({ createdAt: -1 });
  return users;
}