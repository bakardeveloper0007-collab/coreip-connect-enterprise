import { Counter, Reveal } from "./Reveal";

const STATS = [
  { value: 20, label: "Projects Completed" },
  { value: 50, label: "Team Members" },
  { value: 200, label: "Happy Clients" },
  { value: 6, label: "Years of Service" },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="container-x grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="px-2 py-8 text-center lg:py-10">
            <p className="font-display text-3xl font-bold text-primary lg:text-4xl">
              <Counter value={s.value} />
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}