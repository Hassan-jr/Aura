import { Schema, model, models } from "mongoose";

const GenerationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    clientId: {
        type: String,
        required: false,
        default: "auto"
    },
    lora_url: {
      type: String,
      required: false,
    },
    lora_scale: {
      type: Number,
      required: false,
    },
    productId: {
      type: String,
      required: false,
    },
    generations: {
      type: [Object],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Generation = models?.Generation || model("Generation", GenerationSchema);

export default Generation;
