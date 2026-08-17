import { createFileRoute } from "@tanstack/react-router";

import { ProductDetail } from "@/components/catalog/ProductDetail";

export const Route = createFileRoute("/hardware/$category/$product")({
  head: () => ({
    meta: [
      { title: "Product Details — CoreIP Hardware" },
      {
        name: "description",
        content:
          "Full specifications, features, compatibility and enquiry options for this CoreIP hardware product.",
      },
      { property: "og:title", content: "CoreIP Hardware Product" },
      {
        property: "og:description",
        content: "Specifications, features and enquiry for this CoreIP hardware product.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductRoute,
});

function ProductRoute() {
  const { category, product } = Route.useParams();
  return <ProductDetail group="Hardware" categorySlug={category} productSlug={product} />;
}