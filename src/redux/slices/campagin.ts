import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface campaign {
  _id: string;
  title: string;
  userId: string;
  productId: string;
  runId: string;
  isActive: boolean;
  frequency: string;
  scheduledTime: Date;
  outputType: string;
  numberOfPhotos: number;
  sentimentClass: any;
  publishSites: any;
  newRun: boolean;
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface campaignsState {
  campaigns: campaign[];
}

const initialState: campaignsState = {
  campaigns: [],
};

export const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    setcampaigns: (state, action: PayloadAction<campaign[]>) => {
      state.campaigns = action.payload;
    },
    addcampaign: (state, action: PayloadAction<campaign>) => {
      state.campaigns.push(action.payload);
    },
    clearcampaigns: (state) => {
      state.campaigns = [];
    },
  },
});

export const { setcampaigns, addcampaign, clearcampaigns } = campaignsSlice.actions;

// Selector to get all campaigns from the state
export const selectcampaigns = (state: RootState) => state.campaigns.campaigns;

export default campaignsSlice.reducer;
