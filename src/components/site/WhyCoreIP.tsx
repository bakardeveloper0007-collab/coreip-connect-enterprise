import { Cog, Headphones, Layers, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Reveal } from "./Reveal";

const REASONS = [
  {
    icon: Cog,
    title: "Customised technology solutions",
    copy: "Deployments are optimised to your existing telecom and IT estate rather than forced into a fixed template.",
  },
  {
    icon: Layers,
    title: "Enterprise-grade infrastructure",
    copy: "Platforms proven in large government and enterprise rollouts running thousands of lines.",
  },
  {
    icon: Sparkles,
    title: "Unified communication expertise",
    copy: "Voice, video and collaboration is our core discipline — from IPPBX to hosted UCX.",
  },
  {
    icon: ShieldCheck,
    title: "Security and networking together",
    copy: "Communication, network and security layers designed as one architecture.",
  },
  {
    icon: Users,
    title: "In-house engineering",
    copy: "Products backed by our own research, development and technical teams.",
  },
  {
    icon: Headphones,
    title: "End-to-end support",
    copy: "Consultation, implementation and ongoing support from a single accountable partner.",
  },
];

export function WhyCoreIP() {
  return (
    <section className="section-y bg-surface">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Why CoreIP</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground lg:text-[2.6rem]">
            A technology partner, not just a supplier
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 70} className="border-t border-border pt-6">
              <r.icon className="size-5 text-accent" />
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}