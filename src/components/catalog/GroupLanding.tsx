import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { publicQueries } from "@/services/queries";

import { CatalogShell } from "./CatalogShell";
import { CategoryHeader } from "./CategoryHeader";
import { CategoryLink } from "./CatalogLinks";
import { GROUP_SLUG, groupOf, type GroupName } from "./catalog-utils";

const COPY: Record<GroupName, { eyebrow: string; description: string }> = {
  Hardware: {
    eyebrow: "Hardware",
    description:
      "IP phones, switches, routers, servers, gateways, headsets and accessories — supplied, configured and supported by CoreIP engineers.",
  },
  Software: {
    eyebrow: "Software",
    description:
      "Unified communication, network management and video management platforms built and maintained in-house by CoreIP.",
  },
};

export function GroupLanding({ group }: { group: GroupName }) {
  const { data: categories, isLoading } = useQuery(publicQueries.categories());
  const { data: products } = useQuery(publicQueries.products());
  const groupSlug = GROUP_SLUG[group];

  const counts = new Map<string, number>();
  for (const product of products ?? []) {
    const slug = product.category?.slug;
    if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  const items = (categories ?? []).filter((c) => groupOf(c) === group);

  return (
    <CatalogShell>
      <CategoryHeader
        eyebrow={COPY[group].eyebrow}
        title={`${group} portfolio`}
        description={COPY[group].description}
        crumbs={[{ label: group }]}
      />

      <section className="section-y">
        <div className="container-x">
          {isLoading && <p className="text-sm text-muted-foreground">Loading categories…</p>}
          {!isLoading && items.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <p className="font-display text-base font-semibold text-foreground">
                No {group.toLowerCase()} categories published yet
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Add categories from the admin panel and set their main group to {group}.
              </p>
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((category) => (
              <CategoryLink
                key={category.id}
                group={groupSlug}
                category={category.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="relative h-36 overflow-hidden bg-[image:var(--gradient-navy)]">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover opacity-95"
                    />
                  ) : (
                    <div className="bg-grid-faint absolute inset-0 opacity-50" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-primary transition-colors group-hover:text-accent">
                    View range ({counts.get(category.slug) ?? 0})
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </CategoryLink>
            ))}
          </div>
        </div>
      </section>
    </CatalogShell>
  );
}