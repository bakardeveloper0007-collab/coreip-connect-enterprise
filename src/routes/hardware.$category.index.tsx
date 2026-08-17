import { createFileRoute } from "@tanstack/react-router";

import { CategoryListing } from "@/components/catalog/CategoryListing";

export const Route = createFileRoute("/hardware/$category/")({
  head: () => ({
    meta: [
      { title: "Hardware Category — Product Catalog | CoreIP" },
      {
        name: "description",
        content:
          "Compare CoreIP hardware products in this category by brand, price, availability and technical specifications.",
      },
      { property: "og:title", content: "CoreIP Hardware Category" },
      {
        property: "og:description",
        content: "Filter and compare CoreIP hardware products by specification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoryRoute,
});

function CategoryRoute() {
  const { category } = Route.useParams();
  return <CategoryListing group="Hardware" categorySlug={category} />;
}