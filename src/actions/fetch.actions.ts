"use server";
import { connect } from "@/db";
import { Feedback } from "@/modals/feedback.modal";
import UserModel from "@/modals/user.modal";
import { Product } from "@/modals/product.modal";
import { Agent } from "@/modals/agent.modal";
import { ChatMessage } from "@/modals/chatMessage.modal";
import { EmailCredentialsModel } from "@/modals/email.modal";
import { auth } from "@/app/auth";
import { Post } from "@/modals/post.modal";
import { Discount } from "@/modals/discount.modal";

export async function getFeedbacks() {
  await connect();
  const feedback = await Feedback.find().lean().sort({ createdAt: -1 });
  return JSON.parse(
    JSON.stringify(
      feedback.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
      }))
    )
  );
}

export async function getProducts() {
  await connect();
  const user = await auth();
  const products = await Product.find({ userId: user?.user?.id })
    .lean()
    .sort({ createdAt: +1 });
  return JSON.parse(
    JSON.stringify(
      products.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
      }))
    )
  );
}

export async function getSingleProducts(id) {
  await connect();
  const products = await Product.findById(id).lean().sort({ createdAt: +1 });
  return JSON.parse(
    JSON.stringify({
      ...products,
      _id: products?._id.toString(),
      createdAt: products?.createdAt?.toISOString(),
      updatedAt: products?.updatedAt?.toISOString(),
    })
  );
}

export async function getPosts() {
  await connect();
  const user = await auth();
  const products = await Post.find({ userId: user?.user?.id })
    .lean()
    .sort({ createdAt: +1 });
  return JSON.parse(
    JSON.stringify(
      products.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
      }))
    )
  );
}

export async function getEmails() {
  await connect();
  const products = await EmailCredentialsModel.find()
    .lean()
    .sort({ createdAt: +1 });
  return JSON.parse(
    JSON.stringify(
      products.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
      }))
    )
  );
}

export async function getUsers() {
  await connect();
  const users = await UserModel.find().lean().sort({ createdAt: -1 });
  return JSON.parse(
    JSON.stringify(
      users.map((doc) => ({
        ...doc,
        _id: doc._id.toString(),
        createdAt: doc.createdAt?.toISOString(),
        updatedAt: doc.updatedAt?.toISOString(),
      }))
    )
  );
}

export async function fetchAgent(userId: string) {
  try {
    await connect();

    const agent = await Agent.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return agent;
  } catch (error) {
    console.error("Error fetching agent:", error);
    throw error;
  }
}

export async function findChatsForEmail(from: string, bid: string) {
  const users = await UserModel.find({ email: from })
    .lean()
    .sort({ createdAt: -1 });
  const userId = JSON.parse(JSON.stringify(users[0]._id.toString()));

  const messages = await ChatMessage.find({ userId: userId, bId: bid })
    .lean()
    .sort({ createdAt: -1 });

  const productId = messages[0].productId;

  return { messages, userId, productId };
}

// discount
// export async function getUserDiscount(userId, productId) {
//   await connect();
//   const discount = await Discount.find({userId, productId})
//     .lean()
//     .sort({ createdAt: +1 });
//   return JSON.parse(
//     JSON.stringify(
//      {
//         ...discount,
//         _id: discount?._id?.toString(),
//         createdAt: discount?.createdAt?.toISOString(),
//         updatedAt: discount?.updatedAt?.toISOString(),
//       })
//     )

// }

// discount
export async function getUserDiscount(userId, productId) {
  await connect();

  // Get the current date and time
  const currentDate = new Date();

  // Fetch the most recent active discount
  const discount = await Discount.findOne({
    userId,
    productId,
    expiryDate: { $gte: currentDate }, // Ensure the discount is active
  })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .lean(); // Return plain JavaScript objects

  // If a discount is found, format the dates
  if (discount) {
    return {
      ...discount,
      _id: discount?._id.toString(),
      createdAt: discount?.createdAt.toISOString(),
      updatedAt: discount?.updatedAt.toISOString(),
    };
  }

  // Return null if no active discount is found
  return null;
}
