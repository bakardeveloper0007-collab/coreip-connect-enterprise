import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import manufacturing from "@/assets/ind-manufacturing.jpg";
import warehouse from "@/assets/ind-warehouse.jpg";
import healthcare from "@/assets/ind-healthcare.jpg";
import retail from "@/assets/ind-retail.jpg";
import hospitality from "@/assets/ind-hospitality.jpg";
import education from "@/assets/ind-education.jpg";

const INDUSTRIES = [
  {
    name: "Manufacturing",
    image: manufacturing,
    alt: "Connected manufacturing plant floor with networked machinery",
    copy: "Connected communication infrastructure for modern manufacturing environments.",
  },
  {
    name: "Warehouse",
    image: warehouse,
    alt: "Large automated warehouse with networked scanning technology",
    copy: "Reliable voice and network coverage across large logistics facilities.",
  },
  {
    name: "Healthcare",
    image: healthcare,
    alt: "Hospital corridor with communication terminals at nurse stations",
    copy: "Dependable communication and secure connectivity for healthcare operations.",
  },
  {
    name: "Retail",
    image: retail,
    alt: "Modern retail store with connected point of sale terminals",
    copy: "Scalable communication infrastructure for distributed retail environments.",
  },
  {
    name: "Hospitality",
    image: hospitality,
    alt: "Hotel reception desk with an IP desk phone",
    copy: "Guest-facing telephony and networking built for uninterrupted service.",
  },
  {
    name: "Education",
    image: education,
    alt: "University lecture hall equipped with video conferencing display",
    copy: "Campus-wide collaboration, conferencing and network management.",
  },
];

export function Industries() {
  return (
    <section id="industries" className="section-y bg-background">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Industries</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground lg:text-[2.6rem]">
            Built for the environments our customers operate in
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every sector has different uptime, coverage and compliance realities. We size the
            solution to the environment, not the other way round.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <Reveal
              key={ind.name}
              delay={i * 70}
              as="article"
              className="group relative h-72 overflow-hidden rounded-xl border border-border"
            >
              <img
                src={ind.image}
                alt={ind.alt}
                width={768}
                height={576}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--navy-deep)_10%,transparent_85%)] opacity-95" />
              <div className="relative flex h-full flex-col justify-end p-6">
                <h3 className="font-display text-xl font-semibold text-navy-foreground">
                  {ind.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-foreground/70">{ind.copy}</p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan"
                >
                  Explore
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}