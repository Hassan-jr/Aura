import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface discount {
  _id: string;
  userId: string,
  bId: string,
  productId: string,
  agreedDiscountRate: number,
  expiryDate: Date,
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface discountsState {
  discounts: discount[];
}

const initialState: discountsState = {
  discounts: [],
};

export const discountsSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    setdiscounts: (state, action: PayloadAction<discount[]>) => {
      state.discounts = action.payload;
    },
    adddiscount: (state, action: PayloadAction<discount>) => {
      state.discounts.push(action.payload);
    },
    cleardiscounts: (state) => {
      state.discounts = [];
    },
  },
});

export const { setdiscounts, adddiscount, cleardiscounts } = discountsSlice.actions;

// Selector to get all discounts from the state
export const selectdiscounts = (state: RootState) => state.discounts.discounts;

export default discountsSlice.reducer;
