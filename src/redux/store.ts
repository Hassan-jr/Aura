import { configureStore } from '@reduxjs/toolkit';
// Import your reducers here
import exampleReducer from './slices/example';
import trainloraSlice from './slices/trainlora'

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your reducers here
      example: exampleReducer,
      trainlora: trainloraSlice
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];