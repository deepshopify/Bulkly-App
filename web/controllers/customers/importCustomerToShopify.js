import { customerInstance } from "../../service/customer.js";
import { getAccessTokenForShop } from '../../utils/shopifyUtils.js';
import Customer from '../../model/customers/model.js';
import { where } from "sequelize";

const CREATE_CUSTOMER_GRAPHQL_QUERY = `
mutation customerCreate($input: CustomerInput!) {
  customerCreate(input: $input) {
    userErrors {
      field
      message
    }
    customer {
      id
    }
  }
}`;

export const ImportCustomerToShopify = async () => {
    try {
        const customers = await Customer.findAll({
            where: { status: 'pending' },
            limit: 15
        });

        if (customers.length === 0) {
            console.log('No pending customers found');
            return;
        }

        for (const customer of customers) {
            const { shop, email, first_name, last_name, phone, province, address, city, zip, email_marketing, sms_marketing } = customer;
            const accessToken = await getAccessTokenForShop(shop);

            if (!accessToken) {
                console.log(`No access token found for shop ${shop}`);
                continue;
            };

            const data = {
                query: CREATE_CUSTOMER_GRAPHQL_QUERY,
                variables: {
                    input: {
                        firstName: first_name,
                        lastName: last_name,
                        email,
                        phone,
                        addresses: {
                            address1: address,
                            city,
                            zip,
                            country: province
                        },
                        emailMarketingConsent: {
                            marketingState: email_marketing ? "SUBSCRIBED" : "NOT_SUBSCRIBED",
                            marketingOptInLevel: "SINGLE_OPT_IN"
                        },
                        smsMarketingConsent: {
                            marketingState: sms_marketing ? "SUBSCRIBED" : "NOT_SUBSCRIBED",
                            marketingOptInLevel: "SINGLE_OPT_IN"
                        }
                    }
                }
            }

            const response = await customerInstance.importCustomerOnShopify(shop, accessToken, data);
            if (response.data?.data?.customerCreate?.userErrors?.length === 0) {
                console.log(`Customer ${email} imported successfully`);
                await customer.update({ where: { email }, status: 'active' });
                console.log(`Customer ${email} status updated to active`);
            } else {
                console.log(`Failed to import customer ${email}`, response.data?.data?.customerCreate?.userErrors);
            }
        }
    } catch (error) {
        console.error('Error during customer import:', error);
    }
};
