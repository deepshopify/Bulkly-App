import React from "react";
import { Spinner } from "@shopify/polaris";

const LoadingComponent = () => {
    return (
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
    )
};

export default LoadingComponent;