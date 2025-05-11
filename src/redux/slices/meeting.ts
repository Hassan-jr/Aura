import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface meeting {
  _id: string;
  googleEventId: string;
  meetLink: string;
  summary: string;
  description?: string;
  startTime: string; // Store as string (ISO format) or Date
  endTime: string; // Store as string (ISO format) or Date
  timeZone: string;
  attendees?: { email: string }[];
  creator: { email?: string | null; self?: boolean | null };
  organizer: { email?: string | null; self?: boolean | null };
  htmlLink: string;
  userId: string;
  bid: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
// Define the initial state interface
interface meetingsState {
  meetings: meeting[];
}

const initialState: meetingsState = {
  meetings: [],
};

export const meetingsSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    setmeetings: (state, action: PayloadAction<meeting[]>) => {
      state.meetings = action.payload;
    },
    addmeeting: (state, action: PayloadAction<meeting>) => {
      state.meetings.push(action.payload);
    },
    clearmeetings: (state) => {
      state.meetings = [];
    },
  },
});

export const { setmeetings, addmeeting, clearmeetings } = meetingsSlice.actions;

// Selector to get all meetings from the state
export const selectmeetings = (state: RootState) => state.meetings.meetings;

export default meetingsSlice.reducer;
