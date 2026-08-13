import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { RESOURCE_CONFIG } from "@/components/admin/resourceConfig";

const config = RESOURCE_CONFIG.categories;

export const Route = createFileRoute("/admin/categories")({
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
