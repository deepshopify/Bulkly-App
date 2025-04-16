import React, { Fragment, useEffect } from 'react';
import {
    Text,
    useIndexResourceState,
    IndexTable,
    useBreakpoints,
    Thumbnail,
    InlineStack,
} from '@shopify/polaris';
import { useSelector } from 'react-redux';
import { getAllProductDetail } from '../../redux/product/slice';

const ProductVariantList = ({ setSelectedArray }) => {
    const { isLoading, products } = useSelector((state) => getAllProductDetail(state));
    const rows = products;

    const columnHeadings = [
        { title: 'Name', id: 'column-header--size' },
        {
            hidden: false,
            id: 'column-header--price',
            title: 'Price',
        },
        {
            alignment: 'end',
            id: 'column-header--quantity',
            title: 'Available',
        },
    ];

    const groupRowsByGroupKey = (
        groupKey,
        resolveId,
    ) => {
        let position = -1;
        const groups = rows.reduce((groups, product) => {
            const groupVal = product[groupKey];
            if (!groups[groupVal]) {
                position += 1;

                groups[groupVal] = {
                    position,
                    products: [],
                    id: resolveId(groupVal),
                };
            }
            groups[groupVal].products.push({
                ...product,
                position: position + 1,
            });

            position += 1;
            return groups;
        }, {});

        return groups;
    };

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
        useIndexResourceState(rows, {
            resourceFilter: ({ disabled }) => !disabled,
        });

    useEffect(() => {
        clearSelection();
    }, [products]);

    useEffect(() => {
        if (selectedResources.length > 0) {
            const selectedProducts = selectedResources.map((variantId) => {
                const product = products.find(p => p.id === variantId);
                if (product) {
                    return {
                        productId: product.productId,
                        variantId: product.id,
                        title: product.productTitle,
                        imageUrl: product.image,
                        price: product.price
                    };
                }
                return null;
            }).filter(product => product !== null);
            setSelectedArray(selectedProducts);
        }
    }, [setSelectedArray, selectedResources]);

    const groupedProducts = groupRowsByGroupKey(
        'productTitle',
        (productTitle) => `productTitle--${productTitle.toLowerCase()}`,
    );

    const rowMarkup = Object.keys(groupedProducts).map((productTitle, index) => {
        const { products, position, id: productId, image } = groupedProducts[productTitle];

        let selected = false;

        const someProductsSelected = products.some(({ id }) =>
            selectedResources.includes(id),
        );

        const allProductsSelected = products.every(({ id }) =>
            selectedResources.includes(id),
        );

        if (allProductsSelected) {
            selected = true;
        } else if (someProductsSelected) {
            selected = 'indeterminate';
        }

        const selectableRows = rows.filter(({ disabled }) => !disabled);
        const rowRange = [
            selectableRows.findIndex((row) => row.id === products[0].id),
            selectableRows.findIndex(
                (row) => row.id === products[products.length - 1].id,
            ),
        ];

        const disabled = products.every(({ disabled }) => disabled);

        return (
            <Fragment key={productId}>
                <IndexTable.Row
                    rowType="data"
                    selectionRange={rowRange}
                    id={`Parent-${index}`}
                    position={position}
                    selected={selected}
                    disabled={disabled}
                    accessibilityLabel={`Select all products which have color ${productTitle}`}
                >
                    <IndexTable.Cell scope="col" id={productId}>
                        <InlineStack align='start' blockAlign='center'>
                            <Thumbnail alt={products[0]?.image} source={products[0]?.image} size='small' />
                            <Text as="span" fontWeight="semibold">
                                {productTitle}
                            </Text>
                        </InlineStack>
                    </IndexTable.Cell>
                    <IndexTable.Cell />
                    <IndexTable.Cell />
                </IndexTable.Row>
                {products.map(
                    ({ id, variantTitle, quantity, price, position, disabled }, rowIndex) => (
                        <IndexTable.Row
                            rowType="child"
                            key={rowIndex}
                            id={id}
                            position={position}
                            selected={selectedResources.includes(id)}
                            disabled={disabled}
                        >
                            <IndexTable.Cell
                                scope="row"
                                headers={`${columnHeadings[0].id} ${productId}`}
                            >
                                <Text variant="bodyMd" as="span">
                                    {variantTitle}
                                </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Text as="span" numeric>
                                    {price}
                                </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Text as="span" alignment="end" numeric>
                                    {quantity}
                                </Text>
                            </IndexTable.Cell>
                        </IndexTable.Row>
                    ),
                )}
            </Fragment>
        );
    });

    return (
        <IndexTable
            condensed={useBreakpoints().smDown}
            onSelectionChange={handleSelectionChange}
            selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
            }
            resourceName={resourceName}
            itemCount={rows.length}
            headings={columnHeadings}
            loading={isLoading}
        >
            {rowMarkup}
        </IndexTable>
    );
};

export default ProductVariantList;