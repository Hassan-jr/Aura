import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ExampleState {
  id: string;
}

const initialState: ExampleState = {
  id: null,
};

export const productIdSlice = createSlice({
  name: "productId",
  initialState,
  reducers: {
    setProductId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setProductId } = productIdSlice.actions;

export const selectProductId = (state: RootState) => state.productId.id;

export default productIdSlice.reducer;
