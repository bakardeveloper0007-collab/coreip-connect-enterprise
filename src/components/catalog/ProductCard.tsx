import { ArrowRight, Check } from "lucide-react";

import type { ProductWithCategory } from "@/models";

import { ProductLink } from "./CatalogLinks";
import { availabilityOf, brandOf, formatPrice, modelOf, priceOf } from "./catalog-utils";

export function ProductCard({
  product,
  group,
  categorySlug,
}: {
  product: ProductWithCategory;
  group: string;
  categorySlug: string;
}) {
  const price = priceOf(product);
  const model = modelOf(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-lift)]">
      <div className="relative h-40 overflow-hidden bg-[image:var(--gradient-navy)]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-95"
          />
        ) : (
          <div className="bg-grid-faint absolute inset-0 opacity-50" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-navy-deep/80 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-cyan">
          {brandOf(product)}
        </span>
        {product.is_hot && (
          <span className="absolute right-3 top-3 rounded-full bg-[image:var(--gradient-brand)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-cyan-foreground">
            Hot
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold text-foreground">{product.name}</h3>
        {model && <p className="mt-1 text-xs text-muted-foreground">Model: {model}</p>}
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.short_description}
          </p>
        )}

        <ul className="mt-3 flex-1 space-y-1.5 text-sm text-muted-foreground">
          {(product.features ?? []).slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="font-display text-base font-bold text-foreground">{formatPrice(price)}</p>
            <p className="text-xs text-muted-foreground">{availabilityOf(product)}</p>
          </div>
          <ProductLink
            group={group}
            category={categorySlug}
            product={product.slug}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Details
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </ProductLink>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  group,
  categories,
}: {
  products: ProductWithCategory[];
  group: string;
  /** Optional slug override map when products span multiple categories. */
  categories?: (product: ProductWithCategory) => { group: string; category: string } | null;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="font-display text-base font-semibold text-foreground">No products match</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Try clearing a filter, or contact our team for a tailored recommendation.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const resolved = categories?.(product);
        return (
          <ProductCard
            key={product.id}
            product={product}
            group={resolved?.group ?? group}
            categorySlug={resolved?.category ?? product.category?.slug ?? ""}
          />
        );
      })}
    </div>
  );
}