import { createSlice } from '@reduxjs/toolkit';
import { deleteUpsellProductAsync, fetchProductVariantsAsync, fetchUpsellProductsAsync, saveUpsellProductAsync } from './index';

const initialState = {
    isLoading: false,
    isUpsellProductLoading: false,
    isSaveUpsellProductLoading: false,
    isDeleteUpsellProductLoading: false,
    products: [],
    upSellProducts: []
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        handleResetProducts: (state) => {
            state.products = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductVariantsAsync.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchProductVariantsAsync.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.products = payload.products;
        });
        builder.addCase(fetchProductVariantsAsync.rejected, (state) => {
            state.isLoading = false;
            state.products = [];
        });
        builder.addCase(fetchUpsellProductsAsync.pending, (state) => {
            state.isUpsellProductLoading = true;
        });
        builder.addCase(fetchUpsellProductsAsync.fulfilled, (state, { payload }) => {
            state.isUpsellProductLoading = false;
            state.upSellProducts = payload.upSellProducts;
        });
        builder.addCase(fetchUpsellProductsAsync.rejected, (state) => {
            state.isUpsellProductLoading = false;
            state.upSellProducts = [];
        });
        builder.addCase(saveUpsellProductAsync.pending, (state) => {
            state.isSaveUpsellProductLoading = true;
        });
        builder.addCase(saveUpsellProductAsync.rejected, (state) => {
            state.isSaveUpsellProductLoading = false;
        });
        builder.addCase(deleteUpsellProductAsync.pending, (state) => {
            state.isSaveUpsellProductLoading = true;
        });
        builder.addCase(deleteUpsellProductAsync.rejected, (state) => {
            state.isSaveUpsellProductLoading = false;
        });
    }
});

export const { handleResetProducts } = productSlice.actions;

export const getAllProductDetail = (state) => state.product;
export default productSlice.reducer;