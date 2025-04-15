import { shopifyInstance } from "./index.js";

class CustomerInstance {
    importCustomerOnShopify(shop, accessToken, data) {
        const requestInstance = shopifyInstance(shop, accessToken);
        return requestInstance.post(`graphql.json`, data);
    }
}

export const customerInstance = new CustomerInstance();