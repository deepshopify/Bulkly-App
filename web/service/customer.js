import { AwsAuthenticatedInstance, shopifyInstance } from "./index.js";

class CustomerInstance {
    importCustomerOnShopify(shop, accessToken, data) {
        const requestInstance = shopifyInstance(shop, accessToken);
        return requestInstance.post(`graphql.json`, data);
    }
    postAwsFile(url, headers, form) {
        const instance = AwsAuthenticatedInstance(url, headers);
        return instance.post('', form);
    };
}

export const customerInstance = new CustomerInstance();