import { ArrowRight, Handshake, LineChart, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

const BENEFITS = [
  { icon: Handshake, title: "Proven programs", copy: "Structured partner programs designed for long-term collaboration." },
  { icon: Wrench, title: "Partner tools", copy: "Product, pre-sales and deployment resources for partner teams." },
  { icon: LineChart, title: "Better margins", copy: "Dedicated resources to increase earnings and profit margins." },
];

export function Partners() {
  return (
    <section id="partners" className="section-y bg-surface">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Technology partners
          </p>
          <h2 className="mt-3 text-3xl font-bold text-foreground lg:text-[2.6rem]">
            Building better enterprise infrastructure through trusted partnerships
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            CoreIP works with technology partners and channel partners to deliver and support
            solutions across India. Our partner ecosystem gets proven programs, partner tools and
            dedicated resources.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="navy" size="xl" asChild>
              <a href="#contact">
                Become a Partner <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button variant="quiet" size="xl" asChild>
              <a
                href="https://mkp.gem.gov.in/sip-ip-pbx/coreip-ucx-unified-communication-exchange/p-5116877-53818195972-cat.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                CoreIP UCX on GeM
              </a>
            </Button>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 90}
              className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <b.icon className="size-5 text-accent" />
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}