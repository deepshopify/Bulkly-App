import { backendAPI } from "./index.js";

const shop = shopify.config.shop;

export const importCustomers = (formData) => {
  const requestInstance = backendAPI('multipart/form-data');
  return requestInstance.post(`customers/import-csv?shop=${shop}`, formData);
};

export const fetchCustomers = () => {
  const requestInstance = backendAPI();
  return requestInstance.get(`customers?shop=${shop}`);
};
