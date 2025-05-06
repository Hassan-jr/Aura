import { configureStore } from "@reduxjs/toolkit";
// Import your reducers here
import exampleReducer from "./slices/example";
import trainloraSlice from "./slices/trainlora";
import productsSlice from "./slices/product";
import productIdSlice  from "./slices/productId";
import lorasSlice  from "./slices/lora";
import generationsSlice from "./slices/generate";
import calendersSlice  from "./slices/calender";
import feedbacksSlice  from "./slices/feeback";
import agentsSlice from "./slices/agent";
import usersSlice from "./slices/user";
import postsSlice  from "./slices/post";

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your reducers here
      example: exampleReducer,
      trainlora: trainloraSlice,
      products: productsSlice,
      productId: productIdSlice,
      loras: lorasSlice,
      generations: generationsSlice,
      calenders: calendersSlice,
      feedbacks: feedbacksSlice,
      agents: agentsSlice,
      users: usersSlice,
      posts: postsSlice,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
