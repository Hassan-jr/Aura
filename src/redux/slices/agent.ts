import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface agent {
  _id: string;
  title: string;
  userId: string,
  productId: string,
  status: string,
  results: any,
  analysis: any,
  keyPhrases: any[],
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface agentsState {
  agents: agent[];
}

const initialState: agentsState = {
  agents: [],
};

export const agentsSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    setagents: (state, action: PayloadAction<agent[]>) => {
      state.agents = action.payload;
    },
    addagent: (state, action: PayloadAction<agent>) => {
      state.agents.push(action.payload);
    },
    clearagents: (state) => {
      state.agents = [];
    },
  },
});

export const { setagents, addagent, clearagents } = agentsSlice.actions;

// Selector to get all agents from the state
export const selectagents = (state: RootState) => state.agents.agents;

export default agentsSlice.reducer;
