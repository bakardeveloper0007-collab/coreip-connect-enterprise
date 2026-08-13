import { ArrowRight, Activity, Bell, LayoutDashboard, Radar, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import nmsDashboard from "@/assets/nms-dashboard.jpg";

const FEATURES = [
  { icon: Radar, text: "Network monitoring across sites and links" },
  { icon: Server, text: "Device visibility and inventory" },
  { icon: Activity, text: "Performance monitoring and trends" },
  { icon: Bell, text: "Alerts for faults and threshold breaches" },
  { icon: LayoutDashboard, text: "Centralised management console" },
];

export function FeaturedNMS() {
  return (
    <section className="relative overflow-hidden bg-[image:var(--gradient-navy)] section-y">
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-[30rem] w-[30rem] rounded-full bg-cyan/15 blur-[130px]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <img
            src={nmsDashboard}
            alt="CoreIP NMS dashboard showing network topology, performance graphs and alerts"
            width={1280}
            height={960}
            loading="lazy"
            className="rounded-2xl border border-navy-foreground/10 shadow-[var(--shadow-lift)]"
          />
        </Reveal>

        <Reveal delay={120}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">
            Featured technology
          </p>
          <h2 className="mt-3 text-3xl font-bold text-navy-foreground lg:text-[2.6rem]">
            NMS — complete network visibility
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-foreground/70">
            CoreIP NMS gives network teams a single view of the infrastructure they are responsible
            for: what is connected, how it is performing and what needs attention first.
          </p>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-navy-foreground/80">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-cyan/25 bg-navy-foreground/5 text-cyan">
                  <f.icon className="size-4" />
                </span>
                <span className="text-sm">{f.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">
                Explore NMS <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}