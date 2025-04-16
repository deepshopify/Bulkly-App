import { productInstance } from "../../service/product.js";
import { GET_PRODUCT_VARIANT_QUERY } from "../../graphql/query.js";
import { getAccessTokenForShop } from "../../utils/shopifyUtils.js";

export const getProductVariants = async (req, res) => {
    const shop = req.query.shop;
    try {
        if (!shop) {
            return res.status(400).json({ success: false, error: 'Shop query parameter is required' });
        }

        const accessToken = await getAccessTokenForShop(shop);
        if (!accessToken) {
            return res.status(401).json({ success: false, error: `No access token found for shop: ${shop}` });
        }

        const response = await productInstance.fetchProductVariant(shop, accessToken, { query: GET_PRODUCT_VARIANT_QUERY });
        const products = response?.data?.data?.products?.edges || [];
        
        const rows = [];

        products.forEach((productEdge) => {
            const product = productEdge.node;
            product.variants.edges.forEach((variantEdge) => {
                const variant = variantEdge.node;
                rows.push({
                    productId: product?.id,
                    id: variant.id,
                    quantity: productEdge?.variantsCount?.count || 0,
                    price: `$${variant.price}`,
                    image: product?.featuredMedia?.preview?.image?.url || '',
                    variantTitle: variant.title,
                    productTitle: product.title,
                });
            });
        });

        return res.status(200).json({ success: true, products: rows });
    } catch (error) {
        console.error('Error fetching product variants:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
