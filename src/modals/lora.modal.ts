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
    required: true,
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
        required: true,
      },
    },
  ],
});

const Lora = models?.Lora || model("Lora", loraSchema);

export default Lora;
