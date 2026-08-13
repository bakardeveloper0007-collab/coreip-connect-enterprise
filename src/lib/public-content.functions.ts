import { createServerFn } from "@tanstack/react-start";

import type {
  Industry,
  ProductWithCategory,
  Project,
  Service,
} from "@/models";

const PRODUCT_SELECT = "*, category:product_categories(id,name,slug)";

export const fetchProductPage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./public-content.server");
    const client = createPublicClient();
    const { data: product } = await client
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (!product) return { product: null, related: [] as ProductWithCategory[] };

    const typed = product as unknown as ProductWithCategory;
    let related: ProductWithCategory[] = [];
    const ids = typed.related_product_ids ?? [];
    if (ids.length) {
      const { data: rel } = await client
        .from("products")
        .select(PRODUCT_SELECT)
        .in("id", ids)
        .eq("status", "published");
      related = (rel ?? []) as unknown as ProductWithCategory[];
    }
    return { product: typed, related };
  });

export const fetchServicePage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./public-content.server");
    const client = createPublicClient();
    const { data: service } = await client
      .from("services")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (!service) return { service: null, products: [] as ProductWithCategory[] };

    const typed = service as unknown as Service;
    let products: ProductWithCategory[] = [];
    if (typed.related_product_ids?.length) {
      const { data: rel } = await client
        .from("products")
        .select(PRODUCT_SELECT)
        .in("id", typed.related_product_ids)
        .eq("status", "published");
      products = (rel ?? []) as unknown as ProductWithCategory[];
    }
    return { service: typed, products };
  });

export const fetchIndustryPage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./public-content.server");
    const client = createPublicClient();
    const { data: industry } = await client
      .from("industries")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (!industry) return { industry: null, projects: [] as Project[] };

    const typed = industry as unknown as Industry;
    const { data: projects } = await client
      .from("projects")
      .select("*")
      .eq("industry_id", typed.id)
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    return { industry: typed, projects: (projects ?? []) as unknown as Project[] };
  });

export const fetchProjectPage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./public-content.server");
    const client = createPublicClient();
    const { data: project } = await client
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return { project: (project ?? null) as unknown as Project | null };
  });

export const fetchSeoDefaults = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicClient } = await import("./public-content.server");
  const client = createPublicClient();
  const { data } = await client
    .from("website_settings")
    .select("key,value")
    .in("key", ["seo_defaults", "contact_info"]);
  const map: Record<string, unknown> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
});