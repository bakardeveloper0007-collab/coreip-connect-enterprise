import { createFileRoute } from "@tanstack/react-router";

import { GroupLanding } from "@/components/catalog/GroupLanding";

export const Route = createFileRoute("/software/")({
  head: () => ({
    meta: [
      { title: "Software Products — UC, NMS & Management Platforms | CoreIP" },
      {
        name: "description",
        content:
          "Explore CoreIP software platforms: unified communication servers, network management systems and video management software for enterprise deployments.",
      },
      { property: "og:title", content: "CoreIP Software Platforms" },
      {
        property: "og:description",
        content: "Unified communication, network and video management software by CoreIP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <GroupLanding group="Software" />,
});