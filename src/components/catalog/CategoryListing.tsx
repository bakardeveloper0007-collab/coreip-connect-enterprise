import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { publicQueries } from "@/services/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CatalogShell } from "./CatalogShell";
import { CategoryHeader } from "./CategoryHeader";
import { ProductGrid } from "./ProductCard";
import { CatalogNotFound } from "./CatalogNotFound";
import { EMPTY_FILTERS, FilterDrawer, FilterPanel, type FilterState } from "./ProductFilters";
import {
  GROUP_SLUG,
  SORT_OPTIONS,
  type GroupName,
  type SortKey,
  availabilityOf,
  brandOf,
  buildFacets,
  priceOf,
  sortProducts,
  specMap,
} from "./catalog-utils";

export function CategoryListing({
  group,
  categorySlug,
}: {
  group: GroupName;
  categorySlug: string;
}) {
  const { data: categories, isLoading: loadingCategories } = useQuery(publicQueries.categories());
  const { data: allProducts, isLoading } = useQuery(publicQueries.products());
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>("recommended");

  const category = (categories ?? []).find((c) => c.slug === categorySlug);
  const products = useMemo(
    () => (allProducts ?? []).filter((p) => p.category?.slug === categorySlug),
    [allProducts, categorySlug],
  );

  const brands = useMemo(
    () => [...new Set(products.map(brandOf))].sort((a, b) => a.localeCompare(b)),
    [products],
  );
  const availability = useMemo(
    () => [...new Set(products.map(availabilityOf))].sort((a, b) => a.localeCompare(b)),
    [products],
  );
  const facets = useMemo(() => buildFacets(products), [products]);

  const visible = useMemo(() => {
    const min = filters.minPrice ? Number(filters.minPrice) : null;
    const max = filters.maxPrice ? Number(filters.maxPrice) : null;
    const filtered = products.filter((product) => {
      if (filters.brands.length && !filters.brands.includes(brandOf(product))) return false;
      if (filters.availability.length && !filters.availability.includes(availabilityOf(product)))
        return false;
      const price = priceOf(product);
      if (min !== null && (price === null || price < min)) return false;
      if (max !== null && (price === null || price > max)) return false;
      const specs = specMap(product);
      for (const [label, values] of Object.entries(filters.specs)) {
        if (!values.length) continue;
        const actual = specs[label.trim().toLowerCase()];
        if (!actual || !values.includes(actual)) return false;
      }
      return true;
    });
    return sortProducts(filtered, sort);
  }, [products, filters, sort]);

  if (!loadingCategories && !category) {
    return (
      <CatalogNotFound
        title="Category not found"
        description="This category isn't published. Browse the full portfolio instead."
        group={GROUP_SLUG[group]}
      />
    );
  }

  const panelProps = { brands, availability, facets, state: filters, onChange: setFilters };

  return (
    <CatalogShell>
      <CategoryHeader
        eyebrow={group}
        title={category?.name ?? categorySlug}
        description={category?.description}
        image={category?.image_url}
        crumbs={[
          { label: group, to: { group: GROUP_SLUG[group] } },
          { label: category?.name ?? categorySlug },
        ]}
      />

      <section className="section-y">
        <div className="container-x grid gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading products…" : `${visible.length} product(s)`}
              </p>
              <div className="flex items-center gap-2">
                <FilterDrawer {...panelProps} />
                <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                  <SelectTrigger className="w-[13rem]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <ProductGrid products={visible} group={GROUP_SLUG[group]} />
            </div>
          </div>
        </div>
      </section>
    </CatalogShell>
  );
}