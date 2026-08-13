import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { RESOURCE_CONFIG } from "@/components/admin/resourceConfig";

const config = RESOURCE_CONFIG.statistics;

export const Route = createFileRoute("/admin/statistics")({
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
