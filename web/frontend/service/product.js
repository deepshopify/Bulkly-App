import { backendAPI } from "./index.js";

const shop = shopify.config.shop;

export const fetchProductVariants = () => {
    const requestInstance = backendAPI();
    return requestInstance.get(`products?shop=${shop}`);
};

export const fetchUpsellProducts = () => {
  const requestInstance = backendAPI();
  return requestInstance.get(`product/upsell-get?shop=${shop}`);
};

export const saveUpsellProduct = ({ data }) => {
  const requestInstance = backendAPI();
  return requestInstance.post(`product/upsell-save?shop=${shop}`, data);
};

export const deleteUpsellProduct = (data) => {  
  const requestInstance = backendAPI();
  return requestInstance.delete(`product/upsell-delete?shop=${shop}`, data);
};