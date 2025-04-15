import { createSlice } from '@reduxjs/toolkit';
import { importCustomersAsync} from './index';

const initialState = {
    isLoading: false
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(importCustomersAsync.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(importCustomersAsync.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(importCustomersAsync.rejected, (state) => {
            state.isLoading = false;
        });
    }
});

export const getAllCustomerDetail = (state) => state.customer;
export default customerSlice.reducer;