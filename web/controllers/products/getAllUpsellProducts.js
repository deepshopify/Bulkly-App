import UpsellProduct from "../../model/products/model.js";

export const getAllUpsellProducts = async (req, res) => {
    try {
        const { shop } = req.query;

        if (!shop) {
            return res.status(400).json({ success: false, message: "Missing 'shop' query parameter" });
        }

        const products = await UpsellProduct.findAll({
            where: { shop },
            order: [["created_at", "DESC"]],
        });

        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching upsell products:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
