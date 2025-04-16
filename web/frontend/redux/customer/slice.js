import { createSlice } from '@reduxjs/toolkit';
import { fetchCustomersAsync, importCustomersAsync} from './index';

const initialState = {
    isLoading: false,
    isFetchCustomers: false,
    totalCount: 0,
    customers: []
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
        builder.addCase(fetchCustomersAsync.pending, (state) => {
            state.isFetchCustomers = true;
        });
        builder.addCase(fetchCustomersAsync.fulfilled, (state, { payload }) => {
            state.isFetchCustomers = false;
            state.totalCount = payload.totalCount;
            state.customers = payload.customers;
        });
        builder.addCase(fetchCustomersAsync.rejected, (state) => {
            state.isFetchCustomers = false;
            state.totalCount = 0;
            state.customers = [];
        });
    }
});

export const getAllCustomerDetail = (state) => state.customer;
export default customerSlice.reducer;