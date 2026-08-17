import { useQuery } from "@tanstack/react-query";
import { Counter, Reveal } from "./Reveal";
import { publicQueries } from "@/services/queries";

const FALLBACK = [
  { value: 20, label: "Projects Completed", suffix: "" },
  { value: 50, label: "Team Members", suffix: "" },
  { value: 200, label: "Happy Clients", suffix: "" },
  { value: 6, label: "Years of Service", suffix: "" },
];

export function Stats() {
  const { data } = useQuery(publicQueries.statistics());
  const stats = data?.length
    ? data.map((s) => ({ value: Number(s.value), label: s.label, suffix: s.suffix ?? "" }))
    : FALLBACK;
  return (
    <section className="border-y border-border bg-surface">
      <div className="container-x grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="px-2 py-8 text-center lg:py-10">
            <p className="font-display text-3xl font-bold text-primary lg:text-4xl">
              <Counter value={s.value} />
              {s.suffix}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}