import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define the product interface to match the structure of your product schema
interface Product {
  _id: string; // Assuming MongoDB generates an _id field
  title: string;
  userId: string;
  price: number;
  description: string;
  maxDiscountRate: number;
  bargainingPower: number;
  createdAt: string;
  updatedAt: string;
}

// Define the initial state interface
interface ProductsState {
  products: Product[];
}

const initialState: ProductsState = {
  products: [],
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    clearProducts: (state) => {
      state.products = [];
    },
  },
});

export const { setProducts, addProduct, clearProducts } = productsSlice.actions;

// Selector to get all products from the state
export const selectProducts = (state: RootState) => state.products.products;

export default productsSlice.reducer;
