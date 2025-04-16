import { useState, useCallback } from 'react';
import {
    Button,
    LegacyCard,
    ResourceList,
    ResourceItem,
    Text,
    Thumbnail,
    Badge,
    InlineStack,
    Box,
    Filters,
} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import { formatDate } from '../../utils/common';

const UpsellProductList = ({ upSellProducts, handleDeleteUpsellProduct }) => {
    const [queryValue, setQueryValue] = useState('');
    const handleQueryValueRemove = useCallback(
        () => setQueryValue(''),
        [],
    );
    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const items = upSellProducts || [];

    const filters = [];

    const filterControl = (
        <Filters
            queryValue={queryValue}
            filters={filters}
            appliedFilters={[]}
            onQueryChange={setQueryValue}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleClearAll}
            queryPlaceholder='Search upsell products'
        />
    );

    return (
        <LegacyCard>
            <ResourceList
                resourceName={resourceName}
                items={items}
                renderItem={renderItem}
                filterControl={filterControl}
                selectable
            />
        </LegacyCard>
    );

    function renderItem(item) {
        const { id, imageUrl, title, price, isActive, created_at, productId, variantId } = item;
        const media = <Thumbnail size='small' source={imageUrl} alt={imageUrl} />;

        return (
            <ResourceItem id={id} url='' media={media}>
                <InlineStack align='space-between' blockAlign='center' justify="space-between" width="100%">
                    <Box flex="1">
                        <InlineStack align='start' blockAlign='center' gap='200'>
                            <Text variant="bodyMd" fontWeight="bold" as="h3" display="inline-block">
                                {title}
                            </Text>
                            <Badge tone={isActive ? 'success' : 'info-strong'} marginLeft="1em">
                                {isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </InlineStack>
                        <div>{price}</div>
                        <Text as="p" marginTop="0.5em">
                            Created at {formatDate(created_at)}
                        </Text>
                    </Box>
                    <Button tone='critical' icon={DeleteIcon} onClick={() => handleDeleteUpsellProduct({ id, productId, variantId })}>
                    </Button>
                </InlineStack>

            </ResourceItem>
        );
    }
};

export default UpsellProductList;