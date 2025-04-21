import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface lora {
  _id: string; // Assuming MongoDB generates an _id field
  userId: string;
  characterName: string;
  tokenName: string;
  gender: string; // Consider using a union type like 'male' | 'female' | 'other' if applicable
  productId: string;
  caption_dropout_rate: number;
  batch_size: number;
  steps: number;
  optimizer: string;
  lr: number; // learning rate
  quantize: boolean;
  loraPath: string;
  status: string; // Consider using a union type like 'pending' | 'training' | 'completed' | 'failed' if applicable
  trainImgs: {
    // Array of objects
    imgUrl: string; // Each object has an imgUrl property of type string
  }[]; // <- Specifies it's an array of the preceding object type
  captions: {
    // Array of objects
    caption: string; // Each object has a caption property of type string
  }[]; // <- Specifies it's an array of the preceding object type
  createdAt: string; // Or potentially Date type if you work with Date objects
  updatedAt: string; // Or potentially Date type
}
// Define the initial state interface
interface lorasState {
  loras: lora[];
}

const initialState: lorasState = {
  loras: [],
};

export const lorasSlice = createSlice({
  name: "loras",
  initialState,
  reducers: {
    setloras: (state, action: PayloadAction<lora[]>) => {
      state.loras = action.payload;
    },
    addlora: (state, action: PayloadAction<lora>) => {
      state.loras.push(action.payload);
    },
    clearloras: (state) => {
      state.loras = [];
    },
  },
});

export const { setloras, addlora, clearloras } = lorasSlice.actions;

// Selector to get all loras from the state
export const selectloras = (state: RootState) => state.loras.loras;

export default lorasSlice.reducer;
