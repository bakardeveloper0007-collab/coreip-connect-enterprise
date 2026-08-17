import { useQuery } from "@tanstack/react-query";

import type { ProductWithCategory } from "@/models";
import { publicQueries } from "@/services/queries";

import { ProductGrid } from "./ProductCard";
import { GROUP_SLUG, groupOf } from "./catalog-utils";

export function RelatedProducts({ products }: { products: ProductWithCategory[] }) {
  const { data: categories } = useQuery(publicQueries.categories());
  if (products.length === 0) return null;

  return (
    <section className="section-y bg-surface">
      <div className="container-x">
        <h2 className="font-display text-2xl font-bold text-foreground">Related products</h2>
        <div className="mt-6">
          <ProductGrid
            products={products}
            group="hardware"
            categories={(product) => {
              const slug = product.category?.slug;
              if (!slug) return null;
              const category = (categories ?? []).find((c) => c.slug === slug);
              return { group: GROUP_SLUG[groupOf(category)], category: slug };
            }}
          />
        </div>
      </div>
    </section>
  );
}