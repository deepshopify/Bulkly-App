import fs from 'fs';
import csv from 'csv-parser';
import Customer from '../../model/customers/model.js';

export const importCustomersFromCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const customers = [];
  const shop = req.query.shop;

  try {
    const existingCustomers = await Customer.findAll({
      where: { shop },
      attributes: ['email'],
    });
    const existingEmails = new Set(existingCustomers.map((c) => c.email?.toLowerCase()));

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        const email = row['Email']?.trim().toLowerCase();
        if (!email || existingEmails.has(email)) return;
        console.log(row);
        
        const clean = (val) => val?.trim().toLowerCase() === 'yes';

        customers.push({
          shop,
          first_name: row['First Name']?.trim() || '',
          lastname: row['Last Name']?.trim() || '',
          email,
          phone: row['Phone']?.trim() || '',
          tags: row['Tags'] ? row['Tags'].replace(/\n/g, '').split(',').map(tag => tag.trim()) : [],
          address: row['Address']?.trim() || '',
          city: row['City']?.trim() || '',
          state: row['State '] || row['State'] || '',
          province: row['Country']?.trim() || '',
          zip: row['Zip Code']?.trim() || '',
          email_marketing: clean(row['Email Marketing']),
          sms_marketing: clean(row['SMS Marketing']),
          is_premium: clean(row['Premier Customer']),
        });
      })
      .on('end', async () => {
        try {
          if (customers.length > 0) {                        
            await Customer.bulkCreate(customers);
          }
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          res.status(200).json({
            message: `Imported ${customers.length} new customers. Skipped ${existingEmails.size} existing.`,
            success: true,
          });
        } catch (error) {
          console.error('DB error:', error);
          res.status(500).json({ error: 'Failed to save customers to DB', success: false });
        }
      });
  } catch (err) {
    console.error('CSV error:', err);
    res.status(500).json({ error: 'Server error during CSV import', success: false });
  }
};
