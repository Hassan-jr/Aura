import { configureStore } from "@reduxjs/toolkit";
// Import your reducers here
import exampleReducer from "./slices/example";
import trainloraSlice from "./slices/trainlora";
import productsSlice from "./slices/product";
import productIdSlice  from "./slices/productId";
import lorasSlice  from "./slices/lora";
import generationsSlice from "./slices/generate";

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
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
