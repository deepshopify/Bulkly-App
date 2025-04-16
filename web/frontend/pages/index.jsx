import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Layout, Button, Text, BlockStack, Card } from '@shopify/polaris';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap='300'>
              <Text variant="headingLg" as="h6">Welcome to the Bulkly</Text>
              <Text as="p" variant="bodySm">
                Bulkly helps you efficiently manage and grow your Shopify store with the following key features:
              </Text>
            </BlockStack>
            <br />
            <BlockStack gap='200'>
              <Text variant="headingSm" as="h6">✅ Import Customers in Bulk</Text>
              <Text as="p" variant="bodySm">
                Easily upload and import customer data from an Excel sheet using Shopify’s Bulk API.
              </Text>
            </BlockStack>
            <br />
            <BlockStack gap='200'>
              <Text variant="headingSm" as="h6">✅ Product Upsell Features</Text>
              <Text as="p" variant="bodySm">
                Enhance your sales by offering relevant product upsells to customers during checkout.
              </Text>
            </BlockStack>
            <br />
            <Button variant='primary' onClick={() => navigate('/ManageCustomers')}>Get Started</Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
