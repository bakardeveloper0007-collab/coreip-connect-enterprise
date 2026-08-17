import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { publicQueries } from "@/services/queries";
import { ProductLink } from "@/components/catalog/CatalogLinks";
import { GROUP_SLUG, groupOf } from "@/components/catalog/catalog-utils";
import { Reveal } from "./Reveal";
import { PRODUCT_GROUPS } from "./data";

interface DisplayItem {
  name: string;
  value: string;
  caps: string[];
  image?: string | null;
  slug?: string;
  categorySlug?: string;
  group?: string;
}

interface DisplayGroup {
  group: string;
  items: DisplayItem[];
}

export function Products() {
  const { data: categories } = useQuery(publicQueries.categories());
  const { data: products } = useQuery(publicQueries.products());

  const groups = useMemo<DisplayGroup[]>(() => {
    if (!products?.length) return PRODUCT_GROUPS as DisplayGroup[];

    const byCategory = new Map<string, DisplayItem[]>();
    const order: string[] = [];
    for (const category of categories ?? []) {
      order.push(category.name);
      byCategory.set(category.name, []);
    }

    for (const product of products) {
      const label = product.category?.name ?? "Other";
      if (!byCategory.has(label)) {
        byCategory.set(label, []);
        order.push(label);
      }
      byCategory.get(label)!.push({
        name: product.name,
        value: product.short_description ?? "",
        caps: (product.features ?? []).slice(0, 3),
        image: product.image_url,
        slug: product.slug,
        categorySlug: product.category?.slug ?? "",
        group: GROUP_SLUG[
          groupOf((categories ?? []).find((c) => c.slug === product.category?.slug))
        ],
      });
    }

    return order
      .map((label) => ({ group: label, items: byCategory.get(label) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [categories, products]);

  const [active, setActive] = useState<string | null>(null);
  const group = groups.find((g) => g.group === active) ?? groups[0];
  if (!group) return null;

  return (
    <section id="products" className="section-y bg-surface">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Products</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground lg:text-[2.6rem]">
              A complete portfolio for enterprise communication
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Software, communication platforms, networking systems and hardware — developed and
              supported with in-house engineering capability.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Product categories">
          {groups.map((g) => (
            <button
              key={g.group}
              role="tab"
              aria-selected={group.group === g.group}
              onClick={() => setActive(g.group)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                group.group === g.group
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground",
              )}
            >
              {g.group}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {group.items.map((p, i) => (
            <article
              key={p.name}
              className="reveal-in group flex flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-lift)]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative mb-5 h-32 overflow-hidden rounded-lg bg-[image:var(--gradient-navy)]">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover opacity-90"
                  />
                ) : (
                  <div className="bg-grid-faint absolute inset-0 opacity-50" />
                )}
                <span className="absolute bottom-3 left-4 font-display text-xs font-semibold uppercase tracking-[0.16em] text-cyan">
                  {group.group}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.value}</p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted-foreground">
                {p.caps.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                    {c}
                  </li>
                ))}
              </ul>
              {p.slug && p.categorySlug ? (
                <ProductLink
                  group={p.group ?? "hardware"}
                  category={p.categorySlug}
                  product={p.slug}
                  className="mt-5 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-primary transition-colors group-hover:text-accent"
                >
                  View Details
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </ProductLink>
              ) : (
                <a
                  href="/#contact"
                  className="mt-5 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-primary transition-colors group-hover:text-accent"
                >
                  Explore Product
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}