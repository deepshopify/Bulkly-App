import express from "express";
import { saveUpsellProduct } from "../controllers/products/saveUpsellProduct.js";
import { getAllUpsellProducts } from "../controllers/products/getAllUpsellProducts.js";
import { getProductVariants } from "../controllers/products/fetchProductVariants.js";
import { deleteUpsellProduct } from "../controllers/products/deleteUpsellProduct.js";

const router = express.Router();

router.post("/product/upsell-save", saveUpsellProduct);
router.get("/product/upsell-get", getAllUpsellProducts);
router.get("/products", getProductVariants);
router.delete("/product/upsell-delete", deleteUpsellProduct);

export default router;
