import express from "express";
import customerRoute from './customerRoute.js';
const router = express.Router();

router.use(customerRoute);

export default router;