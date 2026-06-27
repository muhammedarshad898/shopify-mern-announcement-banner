# Shopify Announcement Banner App

A Shopify app that lets a merchant set an announcement message from an embedded admin dashboard. The message is stored in MongoDB (for audit history) and synced to a Shopify Shop Metafield, which is then displayed as a floating banner on the storefront via a Theme App Extension.

## Architecture / Data Flow

```
Merchant types message in Admin (React + Polaris)
        ↓
React frontend sends POST request to Express backend
        ↓
Express backend:
  1. Saves { message, timestamp } to MongoDB (audit history)
  2. Calls Shopify Admin GraphQL API to write the value into
     a Shop Metafield (namespace: "my_app", key: "announcement")
        ↓
Storefront Theme App Extension (App Embed Block) reads
{{ shop.metafields.my_app.announcement.value }} via Liquid
and displays it as a floating banner — no extra API call needed.
```

## Project Structure

This is a monorepo with two independently deployable parts:

```
/futureblink-announcement-app   → Shopify embedded admin app (React Router + Polaris)
/backend                        → Express + MongoDB API server
```

## Tech Stack

- **Frontend (Admin):** React, Shopify Polaris, React Router (Shopify CLI app template)
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Storefront:** Shopify Theme App Extension (Liquid, App Embed Block)
- **Shopify API:** Admin GraphQL API (`metafieldsSet` mutation)

---

## Prerequisites

- Node.js 18+
- A MongoDB connection string (e.g. from MongoDB Atlas)
- A Shopify Partner account + development store
- A Shopify Admin API access token with metafield write access (from a custom app on your dev store)

---

## 1. Backend Setup (`/backend`)

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` with the following variables:

```env
PORT=5000
DATABASE=your_mongodb_connection_string
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_API_VERSION=2025-01
SHOPIFY_ACCESS_TOKEN=your_shopify_admin_api_access_token
SHOPIFY_SHOP_ID=gid://shopify/Shop/your_shop_id
```

Run the server:

```bash
npm start
```

The backend will be available at `http://localhost:5000`.

### API Endpoint

`POST /announcement`

Body:
```json
{ "message": "Sale 50% Off" }
```

This saves the message + timestamp to MongoDB and writes it to the shop's `my_app.announcement` metafield via the Shopify Admin API.

---

## 2. Shopify App Setup (`/futureblink-announcement-app`)

```bash
cd futureblink-announcement-app
npm install
```

Run the Shopify app in development mode:

```bash
npm run dev
```

This will:
- Start a local dev server
- Create a tunnel so Shopify can reach your app
- Prompt you to select your Partner organization and development store
- Give you a preview URL to open the app inside your store's admin

### Using the App

1. Open the app from your store's admin sidebar.
2. Type a message in the **Announcement Text** field and click **Save**.
3. The message is sent to the backend (update the fetch URL in
   `app/components/Announcement.jsx` to point at your deployed backend
   URL once deployed, or `http://localhost:5000` for local testing).

---

## 3. Enabling the Storefront Banner

The banner is built as a **Theme App Extension → App Embed Block**, located at:

```
futureblink-announcement-app/extensions/announcement-banner/blocks/star_rating.liquid
```

To activate it on your store:

1. Go to your store admin → **Online Store → Themes**
2. Click **Customize** on your active theme
3. In the theme editor, open **App embeds** (left sidebar)
4. Toggle **Announcement Banner** ON
5. Click **Save**

The banner will now display the current value of the `my_app.announcement` shop metafield on every page of the storefront.

---

## 4. Verifying the Full Flow

1. Save a message from the app's admin dashboard.
2. Check MongoDB — a new document with `{ message, timestamp }` should appear in the `announcements` collection.
3. Visit the storefront — the announcement banner should display the saved message at the top of the page.

---

## Deployment

- **Backend** (`/backend`): Deployed on Render — set the Root Directory to `backend` when connecting this repository.
- **Frontend** (`/futureblink-announcement-app`): Deployed on Vercel — set the Root Directory to `futureblink-announcement-app` when connecting this repository.

Live URLs:
- Deployed app: `<add your deployed frontend URL here>`
- Deployed backend: `<add your deployed backend URL here>`
- Demo video: `<add your Loom/YouTube link here>`

---

## Notes

- The shop metafield (`my_app.announcement`) always holds only the **current** announcement — saving a new message overwrites the previous one. Full history of every announcement ever saved is preserved in MongoDB.
- Namespace `my_app` and key `announcement` are arbitrary, self-chosen identifiers used consistently between the backend (write) and the Liquid template (read).
