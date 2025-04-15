import cron from 'node-cron';
import { ImportCustomerToShopify } from '../controllers/customers/importCustomerToShopify.js';

const Scheduler = () => {
    // Run every hour to check for new customers
    cron.schedule('*/30 * * * * *', async () => {
        console.log('Checking for new customers...');
        await ImportCustomerToShopify()
    });

};

export default Scheduler;