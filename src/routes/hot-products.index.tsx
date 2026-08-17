import { createFileRoute } from "@tanstack/react-router";

import { HotProducts } from "@/components/catalog/HotProducts";

export const Route = createFileRoute("/hot-products/")({
  head: () => ({
    meta: [
      { title: "Hot Products — Featured CoreIP Solutions" },
      {
        name: "description",
        content:
          "The CoreIP products our engineering team is deploying most this quarter — featured IP phones, servers, gateways and platforms.",
      },
      { property: "og:title", content: "CoreIP Hot Products" },
      {
        property: "og:description",
        content: "Featured CoreIP products currently in highest demand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotProducts,
});