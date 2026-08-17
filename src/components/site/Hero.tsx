import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroNetwork from "@/assets/hero-network.jpg";
import { QuoteDialog } from "./QuoteDialog";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[image:var(--gradient-navy)] pt-32 pb-16 lg:pt-40 lg:pb-24"
    >
      <div className="bg-grid-faint pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-cyan/20 blur-[140px] animate-drift" />

      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="reveal-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-navy-foreground/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-cyan">
            Unified Communication · Networking · Security
          </span>
          <h1 className="mt-6 font-display text-4xl leading-[1.08] font-bold text-navy-foreground sm:text-5xl lg:text-[3.65rem]">
            Smarter communication.
            <br />
            <span className="text-gradient-brand">Stronger infrastructure.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-foreground/70 sm:text-lg">
            CoreIP is a technology company that helps organisations implement optimised telecom and
            IT solutions — unified communication, networking, security and hosting infrastructure
            that keeps enterprises connected, secure and productive.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <QuoteDialog
              source="homepage-hero"
              trigger={
                <Button variant="hero" size="xl">
                  Talk to an Expert <ArrowRight className="size-4" />
                </Button>
              }
            />
            <Button variant="onDark" size="xl" asChild>
              <a href="#solutions">Explore Solutions</a>
            </Button>
          </div>
          <p className="mt-8 flex items-center gap-2 text-sm text-navy-foreground/55">
            <PhoneCall className="size-4 text-cyan" /> Speak with our team: +91-120-6618000
          </p>
        </div>

        <div className="relative reveal-in" style={{ animationDelay: "120ms" }}>
          <div className="absolute -inset-6 rounded-3xl bg-cyan/10 blur-3xl" />
          <img
            src={heroNetwork}
            alt="Abstract visualisation of an enterprise communication network connecting offices and a data centre"
            width={1280}
            height={1024}
            className="relative rounded-2xl border border-navy-foreground/10 shadow-[var(--shadow-lift)]"
          />
        </div>
      </div>
    </section>
  );
}