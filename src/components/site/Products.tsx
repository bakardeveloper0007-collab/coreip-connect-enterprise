import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { PRODUCT_GROUPS } from "./data";

export function Products() {
  const [active, setActive] = useState(PRODUCT_GROUPS[0].group);
  const group = PRODUCT_GROUPS.find((g) => g.group === active) ?? PRODUCT_GROUPS[0];

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
          {PRODUCT_GROUPS.map((g) => (
            <button
              key={g.group}
              role="tab"
              aria-selected={active === g.group}
              onClick={() => setActive(g.group)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active === g.group
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
                <div className="bg-grid-faint absolute inset-0 opacity-50" />
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
              <a
                href="#contact"
                className="mt-5 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-primary transition-colors group-hover:text-accent"
              >
                Explore Product
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}