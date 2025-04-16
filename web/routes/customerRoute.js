import express from 'express';
import multer from 'multer';
import { importCustomersFromCSV } from '../controllers/customers/importCustomersFromCSV.js';
import { getAllCustomersFromShopify } from '../controllers/customers/fetchAllCustomers.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/customers/import-csv', upload.single('file'), importCustomersFromCSV);
router.get('/customers', getAllCustomersFromShopify);

export default router;
