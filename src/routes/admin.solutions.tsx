import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { RESOURCE_CONFIG } from "@/components/admin/resourceConfig";

const config = RESOURCE_CONFIG.services;

export const Route = createFileRoute("/admin/solutions")({
  component: () => (
    <ResourceManager
      resource={config.resource}
      title={config.title}
      description={config.description}
      columns={config.columns}
      fields={config.fields}
      titleField={config.titleField}
    />
  ),
});
