import { useState } from "react";
import { Page, Card, TextField, Button, BlockStack } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
const API_URL = import.meta.env.VITE_API_URL;


function Announcement() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const shopify = useAppBridge(); 

  const saveAnnouncement = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      await fetch(`${API_URL}/announcement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      setMessage("");
     shopify.toast.show("Announcement saved!");
    } catch (err) {
      console.log(err);
       shopify.toast.show("Failed to save announcement", { isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Announcement">

      <Card sectioned>
        <BlockStack gap="300">

          <p>Enter message to display on Shopify store</p>

          <TextField
            label="Announcement Message"
            value={message}
            onChange={setMessage}
            autoComplete="off"
            placeholder="50% OFF SALE LIVE NOW"
          />

          <Button
            onClick={saveAnnouncement}
            loading={loading}
            variant="primary"
          >
            Save Announcement
          </Button>

        </BlockStack>
      </Card>

    </Page>
  );
}

export default Announcement;