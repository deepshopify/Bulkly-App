import { useCallback } from 'react';
import {
    DropZone,
    Thumbnail,
    Text,
    BlockStack,
    Spinner
} from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';

const ImportCustomers = ({ loading, file, setFile }) => {
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
            {loading &&
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100vh",
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backdropFilter: "blur(1px)",
                        zIndex: 9999,
                    }}
                >
                    <Spinner accessibilityLabel="Loading" size="large" />
                </div>
            }
        </div>
    );
};

export default ImportCustomers;  