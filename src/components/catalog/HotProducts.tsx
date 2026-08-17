import { useQuery } from "@tanstack/react-query";

import { publicQueries } from "@/services/queries";

import { CatalogShell } from "./CatalogShell";
import { CategoryHeader } from "./CategoryHeader";
import { ProductGrid } from "./ProductCard";
import { GROUP_SLUG, groupOf } from "./catalog-utils";

export function HotProducts() {
  const { data: categories } = useQuery(publicQueries.categories());
  const { data: products, isLoading } = useQuery(publicQueries.products());

  const flagged = (products ?? []).filter((p) => p.is_hot);
  const list = flagged.length ? flagged : (products ?? []).slice(0, 6);

  return (
    <CatalogShell>
      <CategoryHeader
        eyebrow="Featured"
        title="Hot products"
        description="The CoreIP products our engineering team is deploying most this quarter."
        crumbs={[{ label: "Hot products" }]}
      />
      <section className="section-y">
        <div className="container-x">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading products…</p>
          ) : (
            <ProductGrid
              products={list}
              group="hardware"
              categories={(product) => {
                const slug = product.category?.slug;
                if (!slug) return null;
                const category = (categories ?? []).find((c) => c.slug === slug);
                return { group: GROUP_SLUG[groupOf(category)], category: slug };
              }}
            />
          )}
        </div>
      </section>
    </CatalogShell>
  );
}