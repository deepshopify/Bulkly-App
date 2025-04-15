import express from 'express';
import multer from 'multer';
import { importCustomersFromCSV } from '../controllers/customers/customerController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/customers/import-csv', upload.single('file'), importCustomersFromCSV);

export default router;
