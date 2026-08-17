import { createFileRoute } from "@tanstack/react-router";

import { ProductDetail } from "@/components/catalog/ProductDetail";

export const Route = createFileRoute("/software/$category/$product")({
  head: () => ({
    meta: [
      { title: "Product Details — CoreIP Software" },
      {
        name: "description",
        content:
          "Capabilities, licensing, specifications and enquiry options for this CoreIP software platform.",
      },
      { property: "og:title", content: "CoreIP Software Product" },
      {
        property: "og:description",
        content: "Capabilities, specifications and enquiry for this CoreIP software platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductRoute,
});

function ProductRoute() {
  const { category, product } = Route.useParams();
  return <ProductDetail group="Software" categorySlug={category} productSlug={product} />;
}