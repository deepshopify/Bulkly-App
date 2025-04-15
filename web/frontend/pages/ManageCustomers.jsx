import { useState } from "react";
import { BlockStack, Box, Button, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import CustomersTable from "../components/customers/CustomerTable";
import ImportCustomers from "../components/customers/ImportCustomer";
import { useDispatch, useSelector } from "react-redux";
import { importCustomersAsync } from "../redux/customer";
import { getAllCustomerDetail } from "../redux/customer/slice";

const ManageCustomers = () => {
  const shopify = useAppBridge();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => getAllCustomerDetail(state));
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) return;
    dispatch(importCustomersAsync({ file, callback: handleCallBack }));
  };

  const handleCallBack = (success) => {
    if (success) {
      setFile(null);
      handleClose();
    }
  };

  const handleOpen = () => {
    shopify.modal.show('import-customer-modal');
  };

  const handleClose = () => {
    shopify.modal.hide('import-customer-modal');
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Box padding='200'>
            <BlockStack gap='100'>
              <InlineStack align="space-between" blockAlign="center">
                <Box>
                  <Text variant='headingMd'>Customers Overviews</Text>
                  <Text variant='bodySm' tone='subdued'>
                    Shows the imported customers
                  </Text>
                </Box>
                <Button variant="primary" onClick={handleOpen}>Import</Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Layout.Section>
        <Layout.Section>
          <CustomersTable />
        </Layout.Section>
      </Layout>
      <Modal id="import-customer-modal" variant="base">
        <Layout.Section>
          <ImportCustomers
            file={file}
            setFile={setFile}
            loading={isLoading}
            handleUpload={handleUpload}
          />
        </Layout.Section>
        <TitleBar title="Import customers by CSV">
          <button variant='primary' onClick={handleUpload}>Import customers</button>
          <button onClick={handleClose}>Cancel</button>
        </TitleBar>
      </Modal>
    </Page>
  );
}

export default ManageCustomers;