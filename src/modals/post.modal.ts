import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this post."],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description for this post."],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    hashtags: {
      type: [String],
      required: [true, "Please provide at least one hashtag for this post."],
    },
    images: {
      type: [String],
      required: false,
    },
    userId: {
      type: String,
      required: [true, "User ID is required."],
    },
    productId: {
      type: String,
      required: [true, "Product ID is required."],
    },
    generationId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
