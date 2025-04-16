import UpsellProduct from "../../model/products/model.js";

export const saveUpsellProduct = async (req, res) => {
    const shop = req.query.shop;
    try {
        const upsellProducts = req.body;

        if (!shop || !Array.isArray(upsellProducts) || upsellProducts.length === 0) {
            return res.status(400).json({ success: false, message: "Missing required fields or invalid data format" });
        }

        const savedProducts = [];

        for (const product of upsellProducts) {
            const { productId, variantId, title, imageUrl, price } = product;

            if (!productId || !variantId || !title || !imageUrl || !price) {
                continue;
            }
            const existing = await UpsellProduct.findOne({
                where: { shop, productId, variantId },
            });

            if (existing) {
                continue;
            }

            const newUpsell = await UpsellProduct.create({
                shop,
                productId,
                variantId,
                title,
                imageUrl,
                price
            });

            savedProducts.push(newUpsell);
        }

        return res.status(201).json({ success: true, message: "Upsell products saved", data: savedProducts });
    } catch (error) {
        console.error("Error saving upsell products:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
