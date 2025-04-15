import { Card, EmptyState, Page } from "@shopify/polaris";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <Page>
      <Card>
        <Card.Section>
          <EmptyState heading='Page is not found'>
          </EmptyState>
        </Card.Section>
      </Card>
    </Page>
  );
}
