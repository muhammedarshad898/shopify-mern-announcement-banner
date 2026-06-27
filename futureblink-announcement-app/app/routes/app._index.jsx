
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import Announcement from "../components/Announcement";


export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};



export default function Index() {
  return <Announcement />;
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
