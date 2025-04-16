import { customerInstance } from '../../service/customer.js';
import { GET_CUSTOMER_QUERY } from '../../graphql/query.js';
import { getAccessTokenForShop } from '../../utils/shopifyUtils.js';

export const getAllCustomersFromShopify = async (req, res) => {
    const shop = req.query.shop;

    try {
        if (!shop) {
            return res.status(400).json({ error: 'Shop query parameter is required' });
        }

        const accessToken = await getAccessTokenForShop(shop);
        if (!accessToken) {
            return res.status(401).json({ error: `No access token found for shop: ${shop}` });
        }

        const response = await customerInstance.importCustomerOnShopify(shop, accessToken, {
            query: GET_CUSTOMER_QUERY,
        });

        const customers = response?.data?.data?.customers?.edges || [];

        return res.status(200).json({
            success: true,
            totalCount: customers.length,
            customers: customers.map(edge => edge.node),
        });

    } catch (error) {
        console.error('❌ Error fetching customers:', error);
        return res.status(500).json({ error: 'Failed to fetch customers', details: error.message });
    }
};
