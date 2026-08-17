import { createFileRoute } from "@tanstack/react-router";

import { CategoryListing } from "@/components/catalog/CategoryListing";

export const Route = createFileRoute("/software/$category/")({
  head: () => ({
    meta: [
      { title: "Software Category — Product Catalog | CoreIP" },
      {
        name: "description",
        content:
          "Compare CoreIP software platforms in this category by licensing, capability and technical specifications.",
      },
      { property: "og:title", content: "CoreIP Software Category" },
      {
        property: "og:description",
        content: "Filter and compare CoreIP software platforms by specification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoryRoute,
});

function CategoryRoute() {
  const { category } = Route.useParams();
  return <CategoryListing group="Software" categorySlug={category} />;
}