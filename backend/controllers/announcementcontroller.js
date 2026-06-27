const Announcement = require("../models/announcenmentmodel");
exports.createAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Announcement message is required",
      });
    }

    const announcement = await Announcement.create({
      message,
    });
    const response = await fetch(
  `https://${process.env.SHOPIFY_STORE}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: `
      
      mutation {
        metafieldsSet(
          metafields: [
            {
              ownerId: "${process.env.SHOPIFY_SHOP_ID}"
              namespace: "my_app"
              key: "announcement"
              type: "single_line_text_field"
              value: "${message}"
            }
          ]
        ) {
          metafields {
            id
            value
          }
          userErrors {
            message
          }
        }
      }
      
      `,
    }),
  }
);
const shopifyResult = await response.json();

if (shopifyResult.data.metafieldsSet.userErrors.length > 0) {
    return res.status(500).json({
        success: false,
        message: shopifyResult.data.metafieldsSet.userErrors[0].message,
    });
}
    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};