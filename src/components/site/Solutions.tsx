import { ArrowRight, Cloud, Network, PhoneCall, Radio, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { SOLUTIONS } from "./data";

const ICONS = {
  phone: PhoneCall,
  shield: ShieldCheck,
  network: Network,
  radio: Radio,
  cloud: Cloud,
} as const;

export function Solutions() {
  return (
    <section id="solutions" className="section-y bg-background">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">What we solve</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground lg:text-[2.6rem]">
            Solutions engineered around how your organisation actually works
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Our scope of expertise spans unified communications, security, networking, telecom and
            hosting — designed, deployed and supported end to end.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s, i) => {
            const Icon = ICONS[s.icon as keyof typeof ICONS];
            return (
              <Reveal
                key={s.title}
                delay={i * 80}
                as="article"
                className="group relative flex flex-col rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <ul className="mt-5 space-y-1.5 border-t border-border pt-5 text-sm text-muted-foreground">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-accent"
                >
                  Explore Solution
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Reveal>
            );
          })}
          <Reveal
            delay={400}
            className="flex flex-col justify-center rounded-xl border border-dashed border-border bg-surface p-7"
          >
            <h3 className="font-display text-lg font-semibold text-foreground">
              Need something tailored?
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              Most CoreIP deployments are customised. Share your requirement and our engineers will
              design the right architecture.
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
            >
              Request a Quote <ArrowRight className="size-4" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}