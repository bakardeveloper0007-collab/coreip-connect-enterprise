import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, FileText, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { publicQueries } from "@/services/queries";
import { QuoteDialog } from "@/components/site/QuoteDialog";

import { DatasheetDownload } from "./DatasheetDownload";

import { CatalogShell } from "./CatalogShell";
import { CatalogNotFound } from "./CatalogNotFound";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedProducts } from "./RelatedProducts";
import {
  GROUP_SLUG,
  availabilityOf,
  brandOf,
  formatPrice,
  modelOf,
  priceOf,
  type GroupName,
} from "./catalog-utils";

export function ProductDetail({
  group,
  categorySlug,
  productSlug,
}: {
  group: GroupName;
  categorySlug: string;
  productSlug: string;
}) {
  const { data: categories } = useQuery(publicQueries.categories());
  const { data: products, isLoading } = useQuery(publicQueries.products());
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const product = (products ?? []).find((p) => p.slug === productSlug);
  const category = (categories ?? []).find((c) => c.slug === categorySlug);

  const related = useMemo(() => {
    if (!product) return [];
    const explicit = (product.related_product_ids ?? []).length
      ? (products ?? []).filter((p) => product.related_product_ids.includes(p.id))
      : [];
    if (explicit.length) return explicit.slice(0, 3);
    return (products ?? [])
      .filter((p) => p.id !== product.id && p.category?.slug === product.category?.slug)
      .slice(0, 3);
  }, [product, products]);

  if (isLoading) {
    return (
      <CatalogShell>
        <div className="container-x py-24 text-sm text-muted-foreground">Loading product…</div>
      </CatalogShell>
    );
  }

  if (!product) {
    return (
      <CatalogNotFound
        title="Product not found"
        description="This product isn't published or the link has changed."
        group={GROUP_SLUG[group]}
      />
    );
  }

  const gallery = [product.image_url, ...(product.gallery ?? [])].filter(Boolean) as string[];
  const hero = activeImage ?? gallery[0] ?? null;
  const price = priceOf(product);
  const model = modelOf(product);

  return (
    <CatalogShell>
      <div className="border-b border-navy-foreground/10 bg-[image:var(--gradient-navy)] py-6 text-navy-foreground">
        <div className="container-x">
          <Breadcrumbs
            items={[
              { label: group, to: { group: GROUP_SLUG[group] } },
              {
                label: category?.name ?? categorySlug,
                to: { group: GROUP_SLUG[group], category: categorySlug },
              },
              { label: brandOf(product) },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative h-80 overflow-hidden rounded-xl border border-border bg-[image:var(--gradient-navy)]">
              {hero ? (
                <img src={hero} alt={product.name} className="absolute inset-0 size-full object-cover" />
              ) : (
                <div className="bg-grid-faint absolute inset-0 opacity-50" />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {gallery.map((image) => (
                  <button
                    key={image}
                    onClick={() => setActiveImage(image)}
                    className="h-16 w-20 overflow-hidden rounded-md border border-border hover:border-accent"
                    aria-label={`View image of ${product.name}`}
                  >
                    <img src={image} alt="" loading="lazy" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {brandOf(product)}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
              {model && <span>Model: {model}</span>}
              <span className="inline-flex items-center gap-1.5">
                <Package className="size-4 text-accent" />
                {availabilityOf(product)}
              </span>
              {category && <span>Category: {category.name}</span>}
            </div>

            <p className="mt-5 font-display text-2xl font-bold text-foreground">
              {formatPrice(price)}
            </p>

            {product.short_description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {product.short_description}
              </p>
            )}
            {product.long_description && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.long_description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <QuoteDialog
                productInterest={product.name}
                source="product-page"
                title={`Request a quote — ${product.name}`}
                trigger={
                  <Button variant="hero" size="lg">
                    {product.cta_text ?? "Request a quote"}
                  </Button>
                }
              />
              {product.brochure_url && (
                <DatasheetDownload
                  productSlug={product.slug}
                  productName={product.name}
                  brochureUrl={product.brochure_url}
                  access={product.datasheet_access === "gated" ? "gated" : "public"}
                />
              )}
            </div>

            {(product.features ?? []).length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold text-foreground">Key features</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {(product.specifications ?? []).length > 0 && (
          <div className="container-x mt-12">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Technical specifications
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr
                      key={`${spec.label}-${index}`}
                      className="border-b border-border last:border-0 odd:bg-card even:bg-surface"
                    >
                      <th className="w-1/3 px-4 py-3 text-left font-medium text-foreground">
                        {spec.label}
                      </th>
                      <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(product.applications ?? []).length > 0 && (
          <div className="container-x mt-12">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Compatibility &amp; applications
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {product.applications.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <FileText className="mt-0.5 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <RelatedProducts products={related} />
    </CatalogShell>
  );
}