import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customer/slice.js';
import productReducer from './product/slice.js';

const store = configureStore({
  reducer: {
    customer: customerReducer,
    product: productReducer,
  }
});

export default store;