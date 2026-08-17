import type { ProductCategory, ProductWithCategory } from "@/models";

export type GroupName = "Hardware" | "Software";

export const GROUP_SLUG: Record<GroupName, string> = {
  Hardware: "hardware",
  Software: "software",
};

export function groupOf(category: Pick<ProductCategory, "group_name"> | null | undefined): GroupName {
  return category?.group_name === "Software" ? "Software" : "Hardware";
}

export function specMap(product: ProductWithCategory): Record<string, string> {
  const map: Record<string, string> = {};
  for (const spec of product.specifications ?? []) {
    if (spec?.label) map[spec.label.trim().toLowerCase()] = String(spec.value ?? "").trim();
  }
  return map;
}

function pick(product: ProductWithCategory, labels: string[]): string | null {
  const map = specMap(product);
  for (const label of labels) {
    const value = map[label];
    if (value) return value;
  }
  return null;
}

/** Brand comes from a "Brand"/"Make" specification, else the first word of the name. */
export function brandOf(product: ProductWithCategory): string {
  return pick(product, ["brand", "make", "manufacturer"]) ?? product.name.split(" ")[0] ?? "CoreIP";
}

export function modelOf(product: ProductWithCategory): string | null {
  return pick(product, ["model", "model number", "model no", "sku", "part number"]);
}

export function availabilityOf(product: ProductWithCategory): string {
  return pick(product, ["availability", "stock", "stock status"]) ?? "Available on request";
}

/** Numeric price parsed from a "Price"/"MRP" specification; null when not published. */
export function priceOf(product: ProductWithCategory): number | null {
  const raw = pick(product, ["price", "mrp", "list price", "selling price"]);
  if (!raw) return null;
  const digits = raw.replace(/[^0-9.]/g, "");
  if (!digits) return null;
  const value = Number.parseFloat(digits);
  return Number.isFinite(value) ? value : null;
}

export function formatPrice(value: number | null): string {
  if (value === null) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Specification labels that are surfaced as filters (excluding meta labels). */
const META_LABELS = new Set([
  "brand",
  "make",
  "manufacturer",
  "price",
  "mrp",
  "list price",
  "selling price",
  "availability",
  "stock",
  "stock status",
]);

export interface FacetOption {
  label: string;
  values: string[];
}

/** Builds filter facets dynamically from the specifications present on the products. */
export function buildFacets(products: ProductWithCategory[], max = 8): FacetOption[] {
  const facets = new Map<string, { label: string; values: Map<string, number> }>();
  for (const product of products) {
    for (const spec of product.specifications ?? []) {
      const key = spec?.label?.trim().toLowerCase();
      const value = String(spec?.value ?? "").trim();
      if (!key || !value || META_LABELS.has(key)) continue;
      if (value.length > 40) continue;
      const entry = facets.get(key) ?? { label: spec.label.trim(), values: new Map() };
      entry.values.set(value, (entry.values.get(value) ?? 0) + 1);
      facets.set(key, entry);
    }
  }
  return [...facets.entries()]
    .filter(([, entry]) => entry.values.size > 1)
    .sort((a, b) => b[1].values.size - a[1].values.size)
    .slice(0, max)
    .map(([, entry]) => ({
      label: entry.label,
      values: [...entry.values.keys()].sort((a, b) => a.localeCompare(b)),
    }));
}

export type SortKey = "recommended" | "price-asc" | "price-desc" | "newest" | "popular";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
];

export function sortProducts(products: ProductWithCategory[], sort: SortKey): ProductWithCategory[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => (priceOf(a) ?? Infinity) - (priceOf(b) ?? Infinity));
    case "price-desc":
      return list.sort((a, b) => (priceOf(b) ?? -Infinity) - (priceOf(a) ?? -Infinity));
    case "newest":
      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    case "popular":
      return list.sort((a, b) => Number(b.is_hot) - Number(a.is_hot) || a.sort_order - b.sort_order);
    default:
      return list.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
  }
}

export function productPath(
  product: ProductWithCategory,
  categories: ProductCategory[] | undefined,
): { group: string; category: string; product: string } | null {
  const categorySlug = product.category?.slug;
  if (!categorySlug) return null;
  const category = categories?.find((c) => c.slug === categorySlug);
  return {
    group: GROUP_SLUG[groupOf(category)],
    category: categorySlug,
    product: product.slug,
  };
}