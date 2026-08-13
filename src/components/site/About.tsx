import { Reveal } from "./Reveal";

const BLOCKS = [
  {
    heading: "Who we are",
    copy: "CoreIP is a technology company that helps organisations implement optimised and customised telecom and IT solutions with simplicity — a requirement for any organisation that intends to grow reliably.",
  },
  {
    heading: "What we do",
    copy: "We design, deploy and support unified communications, security, networking, telecom and hosting infrastructure for enterprises, institutions and government organisations.",
  },
  {
    heading: "Our expertise",
    copy: "Our capability spans IPPBX and VoIP telephony, video conferencing, network management, video surveillance and enterprise server infrastructure, backed by in-house research and development.",
  },
  {
    heading: "Our approach",
    copy: "We listen first. Solutions are shaped by our customers' needs so teams can work smarter, collaborate easily and get measurable value from the technology they invest in.",
  },
];

export function About() {
  return (
    <section id="company" className="section-y bg-background">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">About CoreIP</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground lg:text-[2.6rem]">
              We focus. We deliver.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              CoreIP promises to deliver best-in-class products and services, strengthened by
              extensive in-house research and development capability.
            </p>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2">
            {BLOCKS.map((b, i) => (
              <Reveal key={b.heading} delay={i * 80} className="border-l-2 border-accent/40 pl-5">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {b.heading}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}