import { Link } from "@tanstack/react-router";

import { CatalogShell } from "./CatalogShell";
import { GroupLink } from "./CatalogLinks";

export function CatalogNotFound({
  title,
  description,
  group,
}: {
  title: string;
  description: string;
  group?: string;
}) {
  return (
    <CatalogShell>
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-6xl font-bold text-foreground">404</p>
        <h1 className="mt-4 font-display text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {group && (
            <GroupLink
              group={group}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Browse catalog
            </GroupLink>
          )}
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-input px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Go home
          </Link>
        </div>
      </div>
    </CatalogShell>
  );
}