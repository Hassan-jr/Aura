import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface calender {
  _id: string;
  userId: string;
  GOOGLE_CLIENT_ID: string,
  GOOGLE_CLIENT_SECRET: string,
  GOOGLE_REFRESH_TOKEN: string,
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface calendersState {
  calenders: calender[];
}

const initialState: calendersState = {
  calenders: [],
};

export const calendersSlice = createSlice({
  name: "calenders",
  initialState,
  reducers: {
    setcalenders: (state, action: PayloadAction<calender[]>) => {
      state.calenders = action.payload;
    },
    addcalender: (state, action: PayloadAction<calender>) => {
      state.calenders.push(action.payload);
    },
    clearcalenders: (state) => {
      state.calenders = [];
    },
  },
});

export const { setcalenders, addcalender, clearcalenders } = calendersSlice.actions;

// Selector to get all calenders from the state
export const selectcalenders = (state: RootState) => state.calenders.calenders;

export default calendersSlice.reducer;
