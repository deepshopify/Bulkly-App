import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteUpsellProduct, fetchProductVariants, fetchUpsellProducts, saveUpsellProduct } from "../../service/product";

export const fetchProductVariantsAsync = createAsyncThunk(
    "product/fetchProductVariants",
    async (params, { rejectWithValue, fulfillWithValue }) => {
        try {      
            const response = await fetchProductVariants(params);
            if (response.data) {
                const { success, products} = response.data;
                if (params.callback) {
                    params.callback(success);
                }
                return fulfillWithValue({
                    products
                });
            }
            return fulfillWithValue({
                products: []
            });
        } catch (err) {
            const message = err?.response?.data?.message;
            shopify.toast.show(message);
            return rejectWithValue();
        }
    }
);

export const fetchUpsellProductsAsync = createAsyncThunk(
    "product/fetchUpsellProducts",
    async (params, { rejectWithValue, fulfillWithValue }) => {
        try {      
            const response = await fetchUpsellProducts(params);
            if (response.data) {
                const { success, data } = response.data;
                if (params.callback) {
                    params.callback(success);
                }
                return fulfillWithValue({
                    upSellProducts: data 
                });
            }
            return fulfillWithValue({
                upSellProducts : []
            });
        } catch (err) {
            const message = err?.response?.data?.message;
            shopify.toast.show(message);
            return rejectWithValue();
        }
    }
);

export const saveUpsellProductAsync = createAsyncThunk(
    "product/saveUpsellProduct",
    async (params, { rejectWithValue, fulfillWithValue }) => {
        try {      
            const response = await saveUpsellProduct(params);
            if (response.data) {
                const { success, message } = response.data;
                if (params.callback) {
                    params.callback(success);
                }
                if (message) {
                    shopify.toast.show(message);
                }
                return fulfillWithValue();
            }
            return fulfillWithValue();
        } catch (err) {
            const message = err?.response?.data?.message;
            shopify.toast.show(message);
            return rejectWithValue();
        }
    }
);

export const deleteUpsellProductAsync = createAsyncThunk(
    "product/deleteUpsellProduct",
    async (params, { rejectWithValue, fulfillWithValue }) => {
        try {      
            const response = await deleteUpsellProduct(params);
            if (response.data) {
                const { success, message } = response.data;
                if (params.callback) {
                    params.callback(success);
                }
                if (message) {
                    shopify.toast.show(message);
                }
                return fulfillWithValue();
            }
            return fulfillWithValue();
        } catch (err) {
            const message = err?.response?.data?.message;
            shopify.toast.show(message);
            return rejectWithValue();
        }
    }
);