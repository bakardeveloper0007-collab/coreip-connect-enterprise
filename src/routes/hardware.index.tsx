import { createFileRoute } from "@tanstack/react-router";

import { GroupLanding } from "@/components/catalog/GroupLanding";

export const Route = createFileRoute("/hardware/")({
  head: () => ({
    meta: [
      { title: "Hardware Products — IP Phones, Switches, Gateways | CoreIP" },
      {
        name: "description",
        content:
          "Browse CoreIP enterprise hardware: IP phones, switches, routers, servers, gateways, headsets and accessories with specifications and datasheets.",
      },
      { property: "og:title", content: "CoreIP Hardware Portfolio" },
      {
        property: "og:description",
        content: "Enterprise communication and networking hardware from CoreIP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <GroupLanding group="Hardware" />,
});