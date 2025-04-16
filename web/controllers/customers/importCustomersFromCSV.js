import Papa from 'papaparse';
import path from 'path';
import FormData from 'form-data';
import { writeFile } from 'fs/promises';
import { mkdirSync, existsSync, createReadStream, statSync } from 'fs';
import { customerInstance } from '../../service/customer.js';
import { BULK_OPERATION_RUN_MUTATION_QUERY, CUSTOMER_CREATE_QUERY, STAGED_UPLOAD_QUERY } from '../../graphql/query.js';
import { getAccessTokenForShop } from '../../utils/shopifyUtils.js';

export const importCustomersFromCSV = async (req, res) => {
  const shop = req.query.shop;
  try {
    const accessToken = await getAccessTokenForShop(shop);
    if (!accessToken) {
      return res.status(401).json({ error: `No access token found for shop ${shop}` });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = file.buffer;
    const fileName = file.originalname;

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const uploadPath = path.join(uploadDir, fileName);
    await writeFile(uploadPath, buffer);

    const jsonlData = [];
    await new Promise((resolve, reject) => {
      const fileStream = createReadStream(uploadPath);
      Papa.parse(fileStream, {
        complete: (result) => {
          result.data.forEach((row) => {
            if (row["Email"]) {
              jsonlData.push(JSON.stringify({
                input: {
                  firstName: row["First Name"] || '',
                  lastName: row["Last Name"] || '',
                  email: row["Email"],
                  phone: row["Phone"] || '',
                  tags: row["Tags"] || '',
                  addresses: {
                    address1: row["Address"] || '',
                    city: row["City"] || '',
                    country: row["Country"] || '',
                    province: row["State"] || '',
                    zip: row["Zip Code"] || ''
                  },
                  emailMarketingConsent: {
                    marketingState: row["Email Marketing"] === 'Yes' ? "SUBSCRIBED" : "NOT_SUBSCRIBED",
                    marketingOptInLevel: "SINGLE_OPT_IN"
                  },
                  smsMarketingConsent: {
                    marketingState: row["SMS Marketing"] === 'Yes' ? "SUBSCRIBED" : "NOT_SUBSCRIBED",
                    marketingOptInLevel: "SINGLE_OPT_IN"
                  }
                }
              }));
            }
          });
          resolve();
        },
        error: reject,
        header: true,
      });
    });

    const jsonlFileName = fileName.replace('.csv', '.jsonl');
    const jsonlFilePath = path.join(uploadDir, jsonlFileName);
    await writeFile(jsonlFilePath, jsonlData.join('\n'));

    const fileSize = statSync(jsonlFilePath).size.toString();

    const stagedUploadsVariables = {
      input: [{
        filename: jsonlFileName,
        httpMethod: 'POST',
        mimeType: 'application/jsonl',
        resource: 'BULK_MUTATION_VARIABLES',
        fileSize,
      }]
    };

    const stagedUploadsQueryResult = await customerInstance.importCustomerOnShopify(shop, accessToken, {
      query: STAGED_UPLOAD_QUERY,
      variables: stagedUploadsVariables,
    });

    const target = stagedUploadsQueryResult.data.data.stagedUploadsCreate.stagedTargets[0];
    const form = new FormData();
    target.parameters.forEach(({ name, value }) => {
      form.append(name, value);
    });
    form.append('file', createReadStream(jsonlFilePath));

    const headers = form.getHeaders();
    const awsResponse = await customerInstance.postAwsFile(target.url, headers, form);

    const keyMatch = awsResponse.data.match(/<Key>([^<]+)<\/Key>/);
    const stagedUploadPath = keyMatch ? keyMatch[1] : null;
    if (!stagedUploadPath) {
      throw new Error("Could not extract stagedUploadPath from AWS XML response");
    }

    const bulkOperationResult = await customerInstance.importCustomerOnShopify(shop, accessToken, {
      query: BULK_OPERATION_RUN_MUTATION_QUERY,
      variables: {
        mutation: CUSTOMER_CREATE_QUERY,
        stagedUploadPath,
      }
    });

    const result = bulkOperationResult?.data?.data?.bulkOperationRunMutation?.bulkOperation;

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ error: 'File upload failed', details: error.message });
  }
};
