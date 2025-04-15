import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './customer/slice.js';

const store = configureStore({
  reducer: {
    customer: customerReducer,
  }
});

export default store;