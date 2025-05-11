import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface campaignResult {
  _id: string;
  userId: string;
  productId: string;
  outputType: string;
  numberOfPhotos: number;
  agentId: string;
  campaignId: string;
  generationId: string;
  postId: string;
  sentimentClass: any;
  publishSites: any;
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface campaignResultsState {
  campaignResults: campaignResult[];
}

const initialState: campaignResultsState = {
  campaignResults: [],
};

export const campaignResultsSlice = createSlice({
  name: "campaignResults",
  initialState,
  reducers: {
    setcampaignResults: (state, action: PayloadAction<campaignResult[]>) => {
      state.campaignResults = action.payload;
    },
    addcampaignResult: (state, action: PayloadAction<campaignResult>) => {
      state.campaignResults.push(action.payload);
    },
    clearcampaignResults: (state) => {
      state.campaignResults = [];
    },
  },
});

export const { setcampaignResults, addcampaignResult, clearcampaignResults } = campaignResultsSlice.actions;

// Selector to get all campaignResults from the state
export const selectcampaignResults = (state: RootState) => state.campaignResults.campaignResults;

export default campaignResultsSlice.reducer;
