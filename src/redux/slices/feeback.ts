import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface feedback {
  _id: string;
  feedback: string;
  productId: string,
  rating: number,
  userId: string,
  polarity: any[],
  emotion: any[],
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface feedbacksState {
  feedbacks: feedback[];
}

const initialState: feedbacksState = {
  feedbacks: [],
};

export const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {
    setfeedbacks: (state, action: PayloadAction<feedback[]>) => {
      state.feedbacks = action.payload;
    },
    addfeedback: (state, action: PayloadAction<feedback>) => {
      state.feedbacks.push(action.payload);
    },
    clearfeedbacks: (state) => {
      state.feedbacks = [];
    },
  },
});

export const { setfeedbacks, addfeedback, clearfeedbacks } = feedbacksSlice.actions;

// Selector to get all feedbacks from the state
export const selectfeedbacks = (state: RootState) => state.feedbacks.feedbacks;

export default feedbacksSlice.reducer;
