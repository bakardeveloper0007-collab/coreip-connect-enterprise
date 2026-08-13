import { Reveal } from "./Reveal";
import { DEPLOYMENTS } from "./data";

export function Deployments() {
  return (
    <section id="deployments" className="section-y bg-background">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Deployments</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground lg:text-[2.6rem]">
            Built for mission-critical communication
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Organisations that depend on always-on communication have trusted CoreIP with
            large-scale unified communication rollouts.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DEPLOYMENTS.map((d, i) => (
            <Reveal
              key={d.customer}
              delay={(i % 3) * 80}
              as="article"
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[var(--shadow-soft)]"
            >
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-accent">
                {d.solution}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                {d.customer}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.impact}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}