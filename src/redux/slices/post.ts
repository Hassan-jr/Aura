import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface post {
  _id: string;
  title: string;
  description: string,
  hashtags: string[],
  images: string[],
  userId: string,
  productId: string,
  generationId: string,
  createdAt: string;
  updatedAt: string;
}
// Define the initial state interface
interface postsState {
  posts: post[];
}

const initialState: postsState = {
  posts: [],
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setposts: (state, action: PayloadAction<post[]>) => {
      state.posts = action.payload;
    },
    addpost: (state, action: PayloadAction<post>) => {
      state.posts.push(action.payload);
    },
    clearposts: (state) => {
      state.posts = [];
    },
  },
});

export const { setposts, addpost, clearposts } = postsSlice.actions;

// Selector to get all posts from the state
export const selectposts = (state: RootState) => state.posts.posts;

export default postsSlice.reducer;
