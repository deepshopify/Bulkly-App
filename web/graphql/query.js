export const GET_CUSTOMER_QUERY = `
query getCustomers {
  customers(first: 250) {
    edges {
        node {
            id
            firstName
            lastName
            email
            image {
                url
            }
            smsMarketingConsent {
                marketingState
            }
            emailMarketingConsent {
                marketingState
            }
        }
    }
  }
}`;

export const STAGED_UPLOAD_QUERY = `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
        stagedTargets {
            resourceUrl
            url
            parameters {
                name
                value
            }
        }
    }
}`;

export const BULK_OPERATION_RUN_MUTATION_QUERY = `
mutation bulkOperationRunMutation($mutation: String!, $stagedUploadPath: String!) {
    bulkOperationRunMutation(
        mutation: $mutation
        stagedUploadPath: $stagedUploadPath
    ) {
        bulkOperation {
            id
            status
            url
        }
        userErrors {
            field
            message
        }
    }
}`;

export const CUSTOMER_CREATE_QUERY = `
mutation call($input: CustomerInput!) {
    customerCreate(input: $input) {
        customer {
            id
        }
        userErrors {
            message
            field
        }
    }
}`;

export const GET_PRODUCT_VARIANT_QUERY = `
query getProductVariants {
    products(first: 250) {
        edges {
            node {
                id
                title
                featuredMedia {
                    preview {
                        image {
                            url
                        }
                    }
                }
                variantsCount {
                    count
                }
                variants(first: 250) {
                    edges {
                        node {
                            id
                            title
                            price
                            image {
                                url
                            }
                        }
                    }
                }
            }
        }
    }
}`;