import { backendAPI } from "./index.js";

const shop = shopify.config.shop;

export const importCustomers = (formData) => {
  const requestInstance = backendAPI();
  return requestInstance.post(`customers/import-csv?shop=${shop}`, formData);
};
