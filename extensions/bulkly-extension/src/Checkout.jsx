import { useEffect, useState } from 'react';
import {
  reactExtension,
  Banner,
  BlockStack,
  Text,
  Button,
  useApplyCartLinesChange,
  useInstructions,
  useTranslate,
  InlineLayout,
  ProductThumbnail,
  useApi,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => <Extension />);

function Extension() {
  const translate = useTranslate();
  const instructions = useInstructions();
  const { shop } = useApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  const [data, setData] = useState([]);
  const host = 'https://proved-return-lexmark-recovery.trycloudflare.com'
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${host}/api/product/upsell-get?shop=${shop.myshopifyDomain}`
        );
        const json = await response.json();
        setData(json?.data || []);
      } catch (error) {
        console.error("Error fetching upsell products:", error);
      }
    }

    fetchData();
  }, []);

  if (!instructions.attributes.canUpdateAttributes) {
    return (
      <Banner title="bulkly-extension" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  return (
    <BlockStack border="dotted" padding="tight" spacing="loose">
      <Text size="medium" emphasis="bold">
        Upsell Recommendation Products
      </Text>
      {data.map((product) => (
        <UpsellProductSection
          key={product.id}
          variantId={product.variantId}
          imageUrl={product.imageUrl}
          title={product.title}
          price={product.price}
          onAdd={async () => {
            const result = await applyCartLinesChange({
              type: "addCartLine",
              merchandiseId: product.variantId,
              quantity: 1,
            });
            console.log("Added to cart:", result);
          }}
        />
      ))}
    </BlockStack>
  );
}

function UpsellProductSection({ imageUrl, title, price, onAdd }) {
  return (
    <InlineLayout spacing="base" blockAlignment="center" border="base" padding="base">
      <ProductThumbnail source={imageUrl} />
      <Text size="small" emphasis="bold">{title}</Text>
      <Text size="small">{price}</Text>
      <Button kind="secondary" onPress={onAdd}>Add</Button>
    </InlineLayout>
  );
}
