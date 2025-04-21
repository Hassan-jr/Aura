import { Schema, model, models } from "mongoose";

const loraSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  characterName: {
    type: String,
    required: true,
  },
  tokenName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  trainImgs: [
    {
      imgUrl: {
        type: String,
        required: true,
      },
    },
  ],
  captions: [
    {
      caption: {
        type: String,
        required: false,
      },
    },
  ],
  // other files
  productId: {
    type: String,
    required: false,
  },
  caption_dropout_rate: {
    type: Number,
    required: false,
  },
  batch_size: {
    type: Number,
    required: false,
  },
  steps: {
    type: Number,
    required: false,
  },
  optimizer: {
    type: String,
    required: false,
  },
  lr: {
    type: Number,
    required: false,
  },
  quantize: {
    type: Boolean,
    required: false,
  },
  loraPath: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  
});

const Lora = models?.Lora || model("Lora", loraSchema);

export default Lora;
