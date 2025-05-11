import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface chat {
  _id: string;
  role: "user" | "assistant";
  content: string;
  userId: string;
  productId: string;
  isImage?: boolean;
  generationId?: string;
  bId: string;
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface chatsState {
  chats: chat[];
}

const initialState: chatsState = {
  chats: [],
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setchats: (state, action: PayloadAction<chat[]>) => {
      state.chats = action.payload;
    },
    addchat: (state, action: PayloadAction<chat>) => {
      state.chats.push(action.payload);
    },
    clearchats: (state) => {
      state.chats = [];
    },
  },
});

export const { setchats, addchat, clearchats } = chatsSlice.actions;

// Selector to get all chats from the state
export const selectchats = (state: RootState) => state.chats.chats;

export default chatsSlice.reducer;
