import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCustomers, importCustomers } from "../../service/customer.js";

export const importCustomersAsync = createAsyncThunk(
    "customer/importCustomers",
    async (params, { rejectWithValue, fulfillWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", params.file);            
            const response = await importCustomers(formData);
            if (response.data) {
                const { success, message } = response.data;
                if (params.callback) {
                    params.callback(success);
                }
                if (message) {
                    shopify.toast.show(message);
                }
                return fulfillWithValue({});
            }
            return fulfillWithValue({});
        } catch (err) {
            const message = err?.response?.data?.message || "Upload failed";
            shopify.toast.show(message);
            return rejectWithValue();
        }
    }
);

export const fetchCustomersAsync = createAsyncThunk(
    "customer/fetchCustomers",
    async (params, { rejectWithValue, fulfillWithValue }) => {
        try {      
            const response = await fetchCustomers(params);
            if (response.data) {
                const { success, customers, totalCount } = response.data;
                if (params.callback) {
                    params.callback(success);
                }
                return fulfillWithValue({
                    customers,
                    totalCount
                });
            }
            return fulfillWithValue({
                customers: [],
                totalCount: 0
            });
        } catch (err) {
            const message = err?.response?.data?.message;
            shopify.toast.show(message);
            return rejectWithValue();
        }
    }
);