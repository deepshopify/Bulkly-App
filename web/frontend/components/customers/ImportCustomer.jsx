import { useCallback } from 'react';
import {
    DropZone,
    Thumbnail,
    Text,
    BlockStack,
} from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';

const ImportCustomers = ({ file, setFile }) => {
    const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles) => {
        setFile(acceptedFiles[0]);
    }, []);

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !file && <DropZone.FileUpload />;
    const uploadedFile = file && (
        <BlockStack>
            <Thumbnail
                size="small"
                alt={file.name}
                source={
                    validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file)
                        : NoteIcon
                }
            />
            <div>
                {file.name}{' '}
                <Text variant="bodySm" as="p">
                    {file.size} bytes
                </Text>
            </div>
        </BlockStack>
    );

    return (
        <div style={{ padding: '20px' }}>
            <DropZone
                allowMultiple={false}
                accept=".csv"
                onDrop={handleDropZoneDrop}
            >
                {uploadedFile}
                {fileUpload}
            </DropZone>
        </div>
    );
};

export default ImportCustomers;  