import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface user {
  _id: string;
  name: string;
  email: string,
  username: string,
  password: string,
  accountType: string,
  profileUrl: string,
  emailVerified: boolean,
  verificationToken: string,
  verificationTokenExpiry: Date,
  image: string,
  isGmail: boolean,
  accounts: any,
  sessions: any,
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface usersState {
  users: user[];
}

const initialState: usersState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setusers: (state, action: PayloadAction<user[]>) => {
      state.users = action.payload;
    },
    adduser: (state, action: PayloadAction<user>) => {
      state.users.push(action.payload);
    },
    clearusers: (state) => {
      state.users = [];
    },
  },
});

export const { setusers, adduser, clearusers } = usersSlice.actions;

// Selector to get all users from the state
export const selectusers = (state: RootState) => state.users.users;

export default usersSlice.reducer;
