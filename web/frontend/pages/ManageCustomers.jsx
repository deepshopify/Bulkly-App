import { useEffect, useState } from "react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { BlockStack, Box, Button, InlineStack, Layout, Page, Text } from "@shopify/polaris";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomersAsync, importCustomersAsync } from "../redux/customer";
import { getAllCustomerDetail } from "../redux/customer/slice";
import ImportCustomers from "../components/customers/ImportCustomer";
import CustomersTable from "../components/customers/CustomerTable";
import LoadingComponent from "../components/loading";

const ManageCustomers = () => {
  const shopify = useAppBridge();
  const dispatch = useDispatch();

  const { isLoading, customers, isFetchCustomers, totalCount } = useSelector((state) => getAllCustomerDetail(state));
  const [file, setFile] = useState(null);

  useEffect(() => {
    handleFetchCustomer();
  }, []);

  const handleUpload = () => {
    if (!file) return;
    dispatch(importCustomersAsync({ file, callback: handleCallBack }));
  };

  const handleCallBack = (success) => {
    if (success) {
      setFile(null);
      handleClose();
      handleFetchCustomer();
    }
  };

  const handleFetchCustomer = () => {
    dispatch(fetchCustomersAsync({}));
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
                  <Text variant='headingMd' as="h6">Customers Overview</Text>
                  <Text variant='bodySm' tone='subdued'>
                    A detailed list of imported customers with their essential information and activity insights.
                  </Text>
                </Box>
                <Button variant="primary" onClick={handleOpen}>Import customers</Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Layout.Section>
        <Layout.Section>
          <CustomersTable
            customers={customers}
            totalCount={totalCount}
            loading={isFetchCustomers}
          />
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
          {isLoading && <LoadingComponent />}
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