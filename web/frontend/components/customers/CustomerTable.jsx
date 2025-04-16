import {
    TextField,
    IndexTable,
    LegacyCard,
    IndexFilters,
    useSetIndexFiltersMode,
    useIndexResourceState,
    Text,
    ChoiceList,
    RangeSlider,
    Badge,
    useBreakpoints,
    Thumbnail,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';

const CustomersTable = ({ customers, totalCount, loading }) => {
    const sleep = (ms) =>
        new Promise((resolve) => setTimeout(resolve, ms));
    const [itemStrings, setItemStrings] = useState([
        'All',
        'Unpaid',
        'Open',
        'Closed',
        'Local delivery',
        'Local pickup',
    ]);
    const deleteView = (index) => {
        const newItemStrings = [...itemStrings];
        newItemStrings.splice(index, 1);
        setItemStrings(newItemStrings);
        setSelected(0);
    };

    const duplicateView = async (name) => {
        setItemStrings([...itemStrings, name]);
        setSelected(itemStrings.length);
        await sleep(1);
        return true;
    };

    const tabs = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => { },
        id: `${item}-${index}`,
        isLocked: index === 0,
        actions:
            index === 0
                ? []
                : [
                    {
                        type: 'rename',
                        onAction: () => { },
                        onPrimaryAction: async (value) => {
                            const newItemsStrings = tabs.map((item, idx) => {
                                if (idx === index) {
                                    return value;
                                }
                                return item.content;
                            });
                            await sleep(1);
                            setItemStrings(newItemsStrings);
                            return true;
                        },
                    },
                    {
                        type: 'duplicate',
                        onPrimaryAction: async (value) => {
                            await sleep(1);
                            duplicateView(value);
                            return true;
                        },
                    },
                    {
                        type: 'edit',
                    },
                    {
                        type: 'delete',
                        onPrimaryAction: async () => {
                            await sleep(1);
                            deleteView(index);
                            return true;
                        },
                    },
                ],
    }));
    const [selected, setSelected] = useState(0);
    const onCreateNewView = async (value) => {
        await sleep(500);
        setItemStrings([...itemStrings, value]);
        setSelected(itemStrings.length);
        return true;
    };
    const sortOptions = [
        { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
        { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
    ];
    const [sortSelected, setSortSelected] = useState(['customer asc']);
    const { mode, setMode } = useSetIndexFiltersMode();
    const onHandleCancel = () => { };

    const onHandleSave = async () => {
        await sleep(1);
        return true;
    };

    const primaryAction =
        selected === 0
            ? {
                type: 'save-as',
                onAction: onCreateNewView,
                disabled: false,
                loading: false,
            }
            : {
                type: 'save',
                onAction: onHandleSave,
                disabled: false,
                loading: false,
            };
    const [accountStatus, setAccountStatus] = useState(
        undefined,
    );
    const [moneySpent, setMoneySpent] = useState(
        undefined,
    );
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState('');

    const handleAccountStatusChange = useCallback(
        (value) => setAccountStatus(value),
        [],
    );
    const handleMoneySpentChange = useCallback(
        (value) => setTaggedWith(value),
    );
    const handleTaggedWithChange = useCallback(
        (value) => setTaggedWith(value),
        [],
    );
    const handleFiltersQueryChange = useCallback(
        (value) => setQueryValue(value),
        [],
    );
    const handleAccountStatusRemove = useCallback(
        () => setAccountStatus(undefined),
        [],
    );
    const handleMoneySpentRemove = useCallback(
        () => setMoneySpent(undefined),
        [],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleFiltersClearAll = useCallback(() => {
        handleAccountStatusRemove();
        handleMoneySpentRemove();
        handleTaggedWithRemove();
        handleQueryValueRemove();
    }, [
        handleAccountStatusRemove,
        handleMoneySpentRemove,
        handleQueryValueRemove,
        handleTaggedWithRemove,
    ]);

    const filters = [
        {
            key: 'accountStatus',
            label: 'Account status',
            filter: (
                <ChoiceList
                    title="Account status"
                    titleHidden
                    choices={[
                        { label: 'Enabled', value: 'enabled' },
                        { label: 'Not invited', value: 'not invited' },
                        { label: 'Invited', value: 'invited' },
                        { label: 'Declined', value: 'declined' },
                    ]}
                    selected={accountStatus || []}
                    onChange={handleAccountStatusChange}
                    allowMultiple
                />
            ),
            shortcut: true,
        },
        {
            key: 'taggedWith',
            label: 'Tagged with',
            filter: (
                <TextField
                    label="Tagged with"
                    value={taggedWith}
                    onChange={handleTaggedWithChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: true,
        },
        {
            key: 'moneySpent',
            label: 'Money spent',
            filter: (
                <RangeSlider
                    label="Money spent is between"
                    labelHidden
                    value={moneySpent || [0, 500]}
                    prefix="$"
                    output
                    min={0}
                    max={2000}
                    step={1}
                    onChange={handleMoneySpentChange}
                />
            ),
        },
    ];

    const appliedFilters = [];
    if (accountStatus && !isEmpty(accountStatus)) {
        const key = 'accountStatus';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, accountStatus),
            onRemove: handleAccountStatusRemove,
        });
    }
    if (moneySpent) {
        const key = 'moneySpent';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, moneySpent),
            onRemove: handleMoneySpentRemove,
        });
    }
    if (!isEmpty(taggedWith)) {
        const key = 'taggedWith';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, taggedWith),
            onRemove: handleTaggedWithRemove,
        });
    }

    const orders = customers;

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(orders);

    const rowMarkup = orders.map(
        (
            { id, firstName, lastName, email, image, smsMarketingConsent, emailMarketingConsent },
            index,
        ) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Thumbnail size='small' alt={image?.url} source={image?.url} />
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {`${firstName} ${lastName}`}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{email}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge tone={smsMarketingConsent?.marketingState === 'SUBSCRIBED' ? 'success' : 'warning'}>{smsMarketingConsent?.marketingState}</Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge tone={emailMarketingConsent?.marketingState === 'SUBSCRIBED' ? 'success' : 'warning'}>{emailMarketingConsent?.marketingState}</Badge>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <LegacyCard>
            <IndexFilters
                sortOptions={sortOptions}
                sortSelected={sortSelected}
                queryValue={queryValue}
                queryPlaceholder="Searching in all"
                onQueryChange={handleFiltersQueryChange}
                onQueryClear={() => setQueryValue('')}
                onSort={setSortSelected}
                primaryAction={[]}
                cancelAction={{
                    onAction: onHandleCancel,
                    disabled: false,
                    loading: false,
                }}
                tabs={tabs}
                selected={selected}
                onSelect={setSelected}
                canCreateNewView={false}
                onCreateNewView={onCreateNewView}
                filters={[]}
                appliedFilters={[]}
                onClearAll={handleFiltersClearAll}
                mode={mode}
                setMode={setMode}
            />
            <IndexTable
                condensed={useBreakpoints().smDown}
                resourceName={resourceName}
                itemCount={orders.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                    { title: 'Image' },
                    { title: 'Name' },
                    { title: 'email' },
                    { title: 'Email Marketing Status' },
                    { title: 'SMS Marketing Status' },
                ]}
                pagination={{
                    label: `total customers ${totalCount}`
                }}
                loading={loading}
            >
                {rowMarkup}
            </IndexTable>
        </LegacyCard>
    );

    function disambiguateLabel(key, value) {
        switch (key) {
            case 'moneySpent':
                return `Money spent is between $${value[0]} and $${value[1]}`;
            case 'taggedWith':
                return `Tagged with ${value}`;
            case 'accountStatus':
                return (value).map((val) => `Customer ${val}`).join(', ');
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value?.length === 0;
        } else {
            return value === '' || value == null;
        }
    }
};

export default CustomersTable;