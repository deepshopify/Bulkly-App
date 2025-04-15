import axios from "axios";

export const shopifyInstance = (shop, accessToken) => {
    return axios.create({
        baseURL: `https://${shop}/admin/api/2024-10/`,
        headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
        }
    });
};