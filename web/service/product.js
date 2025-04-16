import { shopifyInstance } from "./index.js";

class ProductInstance {
    fetchProductVariant(shop, accessToken, data) {
        const requestInstance = shopifyInstance(shop, accessToken);
        return requestInstance.post(`graphql.json`, data);
    }
}

export const productInstance = new ProductInstance();