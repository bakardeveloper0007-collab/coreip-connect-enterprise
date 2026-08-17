import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/** Shared chrome for every catalog page — same header/footer as the homepage. */
export function CatalogShell({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pt-18">{children}</main>
      <SiteFooter />
    </div>
  );
}