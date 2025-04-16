import UpsellProduct from "../../model/products/model.js";

export const deleteUpsellProduct = async (req, res) => {
    const shop = req.query.shop;
    const { id, productId, variantId } = req.body;

    try {
        if (!shop || !id || (!productId && !variantId)) {
            return res.status(400).json({ success: false, message: "Missing required fields: shop, id, and productId/variantId" });
        }

        const whereClause = {
            shop,
            id,
            ...(productId && { productId }),
            ...(variantId && { variantId }),
        };

        const deletedProduct = await UpsellProduct.destroy({
            where: whereClause,
        });

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Upsell product not found" });
        }

        return res.status(200).json({ success: true, message: "Upsell product deleted successfully" });
    } catch (error) {
        console.error("Error deleting upsell product:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
