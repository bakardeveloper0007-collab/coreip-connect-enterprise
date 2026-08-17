import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function CategoryHeader({
  eyebrow,
  title,
  description,
  crumbs,
  image,
  meta,
}: {
  eyebrow: string;
  title: string;
  description?: string | null | undefined;
  crumbs: Crumb[];
  image?: string | null | undefined;
  meta?: ReactNode;
}) {
  return (
    <header className="border-b border-navy-foreground/10 bg-[image:var(--gradient-navy)] text-navy-foreground">
      <div className="container-x py-10 lg:py-14">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">{eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight lg:text-[2.6rem]">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-foreground/70">
                {description}
              </p>
            )}
            {meta && <div className="mt-5">{meta}</div>}
          </div>
          {image && (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-44 w-full rounded-xl border border-navy-foreground/10 object-cover"
            />
          )}
        </div>
      </div>
    </header>
  );
}