import { useState } from "react";
import { Page, Card, TextField, Button, BlockStack } from "@shopify/polaris";

function Announcement() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const saveAnnouncement = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      await fetch("http://localhost:5000/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      setMessage("");
      alert("Saved!");
    } catch (err) {
      console.log(err);
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