import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { CategoryLink, GroupLink } from "./CatalogLinks";

export interface Crumb {
  label: string;
  /** Omit for the current page. */
  to?: { group: string; category?: string };
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      <Link to="/" className="text-navy-foreground/60 transition-colors hover:text-cyan">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const className = isLast
          ? "font-medium text-navy-foreground"
          : "text-navy-foreground/60 transition-colors hover:text-cyan";
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-navy-foreground/30" />
            {item.to && !isLast ? (
              item.to.category ? (
                <CategoryLink group={item.to.group} category={item.to.category} className={className}>
                  {item.label}
                </CategoryLink>
              ) : (
                <GroupLink group={item.to.group} className={className}>
                  {item.label}
                </GroupLink>
              )
            ) : (
              <span className={className}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}