import React, { useEffect, useState } from "react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { BlockStack, Box, Button, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductDetail, handleResetProducts } from "../redux/product/slice";
import { deleteUpsellProductAsync, fetchProductVariantsAsync, fetchUpsellProductsAsync, saveUpsellProductAsync } from "../redux/product";
import ProductVariantList from "../components/products/ProductVariantList";
import UpsellProductList from "../components/products/UpsellProductTable";
import LoadingCcomponent from '../components/loading';

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { isUpsellProductLoading, upSellProducts } = useSelector((state) => getAllProductDetail(state));
  const shopify = useAppBridge();
  const [selectedArray, setSelectedArray] = useState([]);

  useEffect(() => {
    handleFetchUpsellProduct();
  }, []);

  const handleSaveUpsellProduct = () => {
    dispatch(saveUpsellProductAsync({
      data: selectedArray,
      callback: handleCallback
    }));
  };

  const handleDeleteUpsellProduct = (data) => {
    dispatch(deleteUpsellProductAsync({
      data: data,
      callback: handleCallback
    }))
  };

  const handleFetchUpsellProduct = () => {
    dispatch(fetchUpsellProductsAsync({}));
  };

  const handleCallback = (success) => {
    if (success) {
      handleClose();
      setSelectedArray([]);
      handleFetchUpsellProduct();
    }
  }

  const handleOpen = () => {
    dispatch(handleResetProducts());
    shopify.modal.show('product-modal');
    dispatch(fetchProductVariantsAsync({}));
  };

  const handleClose = () => {
    shopify.modal.hide('product-modal');
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Box padding='200'>
            <BlockStack gap='100'>
              <InlineStack align="space-between" blockAlign="center">
                <Box>
                  <Text variant='headingMd' as="h6">Manage Your Upsell Products</Text>
                  <Text variant='bodySm' tone='subdued'>
                    View and organize the products you're offering as upsells during checkout.
                  </Text>
                </Box>
                <Button variant="primary" onClick={handleOpen}>Add products</Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Layout.Section>
        <Layout.Section>
          <UpsellProductList
            upSellProducts={upSellProducts}
            handleDeleteUpsellProduct={handleDeleteUpsellProduct}
          />
        </Layout.Section>
      </Layout>
      {isUpsellProductLoading && <LoadingCcomponent />}
      <Modal id="product-modal" variant="base">
        <Layout.Section>
          <ProductVariantList
            setSelectedArray={setSelectedArray}
          />
        </Layout.Section>
        <TitleBar title="Add products">
          <button variant='primary' disabled={selectedArray?.length === 0} onClick={handleSaveUpsellProduct}>Save</button>
          <button onClick={handleClose}>Cancel</button>
        </TitleBar>
      </Modal>
    </Page>
  );
}

export default ManageProducts;