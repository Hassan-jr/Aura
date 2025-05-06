import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface generate {
  _id: string;
  userId: string;
  clientId: string;
  lora_url: string;
  lora_scale: number;
  productId: string;
  isVideo: boolean;
  generations: any[];
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface generationsState {
  generations: generate[];
}

const initialState: generationsState = {
  generations: [],
};

export const generationsSlice = createSlice({
  name: "generations",
  initialState,
  reducers: {
    setgenerations: (state, action: PayloadAction<generate[]>) => {
      state.generations = action.payload;
    },
    addgenerate: (state, action: PayloadAction<generate>) => {
      state.generations.push(action.payload);
    },
    cleargenerations: (state) => {
      state.generations = [];
    },
  },
});

export const { setgenerations, addgenerate, cleargenerations } = generationsSlice.actions;

// Selector to get all generations from the state
export const selectgenerations = (state: RootState) => state.generations.generations;

export default generationsSlice.reducer;
