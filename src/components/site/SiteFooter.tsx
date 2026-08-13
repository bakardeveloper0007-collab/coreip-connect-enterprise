import { CONTACT, SOLUTIONS, PRODUCT_GROUPS } from "./data";

export function SiteFooter() {
  const columns = [
    { title: "Solutions", links: SOLUTIONS.map((s) => ({ label: s.title, href: "#solutions" })) },
    {
      title: "Products",
      links: PRODUCT_GROUPS.flatMap((g) => g.items)
        .slice(0, 6)
        .map((p) => ({ label: p.name, href: "#products" })),
    },
    {
      title: "Industries",
      links: [
        "Manufacturing",
        "Warehouse",
        "Healthcare",
        "Retail",
        "Hospitality",
        "Education",
      ].map((l) => ({ label: l, href: "#industries" })),
    },
    {
      title: "Company",
      links: [
        { label: "About CoreIP", href: "#company" },
        { label: "Deployments", href: "#deployments" },
        { label: "Partners", href: "#partners" },
        { label: "Blog", href: "https://www.coreip.co.in/blog/" },
        { label: "Support", href: "#contact" },
        { label: "Contact", href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.2fr_2.6fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-[image:var(--gradient-brand)] font-display text-sm font-bold text-cyan-foreground">
              CI
            </span>
            <span className="font-display text-lg font-bold">
              CORE<span className="text-cyan">IP</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-foreground/60">
            CoreIP helps organisations build secure, connected and intelligent communication
            infrastructure — unified communications, networking, security, telecom and hosting.
          </p>
          <address className="mt-6 space-y-1.5 text-sm not-italic text-navy-foreground/70">
            <p>{CONTACT.address}</p>
            <p>
              <a href={`tel:${CONTACT.phone}`} className="hover:text-cyan">
                {CONTACT.phone}
              </a>{" "}
              ·{" "}
              <a href={`tel:${CONTACT.altPhone}`} className="hover:text-cyan">
                {CONTACT.altPhone}
              </a>
            </p>
            <p>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-cyan">
                {CONTACT.email}
              </a>
            </p>
          </address>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-navy-foreground/65 transition-colors hover:text-navy-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-navy-foreground/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-navy-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CoreIP. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://www.coreip.co.in/privacy-policy/" className="hover:text-navy-foreground">
              Privacy Policy
            </a>
            <a href="https://www.coreip.co.in/terms-condition/" className="hover:text-navy-foreground">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}