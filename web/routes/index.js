import express from "express";
import customerRoute from './customerRoute.js';
import productRoute from './productRoute.js';
const router = express.Router();

router.use(customerRoute);
router.use(productRoute);

export default router;