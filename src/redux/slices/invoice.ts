import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface invoice {
  _id: string;
  userId: string,
  bId: string,
  productId: string,
  qty: number,
  expiryDate: Date,
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface invoicesState {
  invoices: invoice[];
}

const initialState: invoicesState = {
  invoices: [],
};

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setinvoices: (state, action: PayloadAction<invoice[]>) => {
      state.invoices = action.payload;
    },
    addinvoice: (state, action: PayloadAction<invoice>) => {
      state.invoices.push(action.payload);
    },
    clearinvoices: (state) => {
      state.invoices = [];
    },
  },
});

export const { setinvoices, addinvoice, clearinvoices } = invoicesSlice.actions;

// Selector to get all invoices from the state
export const selectinvoices = (state: RootState) => state.invoices.invoices;

export default invoicesSlice.reducer;
