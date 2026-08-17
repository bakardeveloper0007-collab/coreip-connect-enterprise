import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { publicQueries } from "@/services/queries";
import { SOLUTIONS, PRODUCT_GROUPS } from "./data";

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="CoreIP home">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-[image:var(--gradient-brand)] font-display text-sm font-bold text-cyan-foreground">
        CI
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-navy-foreground">
        CORE<span className="text-cyan">IP</span>
      </span>
    </a>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const { data: services } = useQuery(publicQueries.services());
  const { data: categories } = useQuery(publicQueries.categories());
  const { data: products } = useQuery(publicQueries.products());

  // Menus are CMS-driven: published Solutions and Products grouped by category.
  const solutionLinks = services?.length
    ? services.map((s) => ({ title: s.name, description: s.short_description ?? "" }))
    : SOLUTIONS.map((s) => ({ title: s.title, description: s.description }));

  const productGroups = products?.length
    ? (() => {
        const order: string[] = [];
        const map = new Map<string, { name: string }[]>();
        for (const c of categories ?? []) {
          order.push(c.name);
          map.set(c.name, []);
        }
        for (const p of products) {
          const label = p.category?.name ?? "Other";
          if (!map.has(label)) {
            map.set(label, []);
            order.push(label);
          }
          map.get(label)!.push({ name: p.name });
        }
        return order
          .map((group) => ({ group, items: map.get(group) ?? [] }))
          .filter((g) => g.items.length > 0);
      })()
    : PRODUCT_GROUPS.map((g) => ({ group: g.group, items: g.items.map((i) => ({ name: i.name })) }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Industries", href: "#industries" },
    { label: "Partners", href: "#partners" },
    { label: "Company", href: "#company" },
    { label: "Resources", href: "#deployments" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-navy-foreground/10 bg-navy-deep/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="container-x flex h-18 items-center justify-between gap-6 py-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {(["Solutions", "Products"] as const).map((menu) => (
            <button
              key={menu}
              onMouseEnter={() => setOpen(menu)}
              onClick={() => setOpen(open === menu ? null : menu)}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/80 transition-colors hover:text-navy-foreground",
                open === menu && "text-navy-foreground",
              )}
              aria-expanded={open === menu}
            >
              {menu}
              <ChevronDown
                className={cn("size-3.5 transition-transform", open === menu && "rotate-180")}
              />
            </button>
          ))}
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onMouseEnter={() => setOpen(null)}
              className="rounded-md px-3 py-2 text-sm font-medium text-navy-foreground/80 transition-colors hover:text-navy-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button variant="hero" size="default" asChild>
            <a href="#contact">Talk to an Expert</a>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-navy-foreground lg:hidden"
          onClick={() => setMobile((v) => !v)}
          aria-label="Toggle navigation"
        >
          {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mega menus */}
      <div
        className={cn(
          "hidden overflow-hidden border-navy-foreground/10 bg-navy-deep/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:block",
          open ? "max-h-[34rem] border-t opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {open === "Solutions" && (
          <div className="container-x grid grid-cols-3 gap-x-10 gap-y-4 py-8">
            {solutionLinks.map((s) => (
              <a
                key={s.title}
                href="#solutions"
                onClick={() => setOpen(null)}
                className="group rounded-lg border border-transparent p-4 transition-colors hover:border-cyan/30 hover:bg-navy-foreground/5"
              >
                <p className="font-display text-sm font-semibold text-navy-foreground">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-foreground/60">
                  {s.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowRight className="size-3" />
                </span>
              </a>
            ))}
          </div>
        )}
        {open === "Products" && (
          <div className="container-x grid grid-cols-4 gap-8 py-8">
            {productGroups.map((g) => (
              <div key={g.group}>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan">
                  {g.group}
                </p>
                <ul className="mt-3 space-y-2">
                  {g.items.map((i) => (
                    <li key={i.name}>
                      <a
                        href="#products"
                        onClick={() => setOpen(null)}
                        className="text-sm text-navy-foreground/75 transition-colors hover:text-cyan"
                      >
                        {i.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile nav */}
      {mobile && (
        <div className="border-t border-navy-foreground/10 bg-navy-deep/98 backdrop-blur-xl lg:hidden">
          <div className="container-x max-h-[70vh] space-y-6 overflow-y-auto py-6">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan">
                Solutions
              </p>
              <ul className="mt-2 space-y-2">
                {solutionLinks.map((s) => (
                  <li key={s.title}>
                    <a
                      href="#solutions"
                      onClick={() => setMobile(false)}
                      className="text-sm text-navy-foreground/80"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan">
                Products
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {productGroups.flatMap((g) => g.items).map((i) => (
                  <li key={i.name}>
                    <a
                      href="#products"
                      onClick={() => setMobile(false)}
                      className="text-sm text-navy-foreground/80"
                    >
                      {i.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid gap-2 border-t border-navy-foreground/10 pt-4">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setMobile(false)}
                    className="text-sm font-medium text-navy-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button variant="hero" size="xl" className="w-full" asChild>
              <a href="#contact" onClick={() => setMobile(false)}>
                Talk to an Expert
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}