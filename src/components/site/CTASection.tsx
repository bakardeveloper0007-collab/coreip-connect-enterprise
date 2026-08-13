import { ArrowRight, Mail, MapPin, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { CONTACT } from "./data";

export function CTASection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[image:var(--gradient-navy)] section-y"
    >
      <div className="bg-grid-faint pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="pointer-events-none absolute -top-24 left-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan/15 blur-[130px] animate-drift" />
      <div className="container-x relative">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl font-bold text-navy-foreground lg:text-[2.9rem] lg:leading-[1.1]">
            Let's build a smarter, more connected enterprise.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/70 lg:text-lg">
            Talk to our technology experts about your communication, networking, security or
            infrastructure requirements.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="hero" size="xl" asChild>
              <a href={`tel:${CONTACT.phone}`}>
                Talk to an Expert <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button variant="onDark" size="xl" asChild>
              <a href={`mailto:${CONTACT.email}?subject=Request%20a%20Quote`}>Request a Quote</a>
            </Button>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 border-t border-navy-foreground/10 pt-10 sm:grid-cols-3">
          {[
            { icon: PhoneCall, label: "Call us", value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
            { icon: Mail, label: "Email us", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
            { icon: MapPin, label: "Visit us", value: CONTACT.address },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 90}>
              <c.icon className="size-4 text-cyan" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-navy-foreground/50">
                {c.label}
              </p>
              {c.href ? (
                <a
                  href={c.href}
                  className="mt-1.5 block text-sm text-navy-foreground transition-colors hover:text-cyan"
                >
                  {c.value}
                </a>
              ) : (
                <p className="mt-1.5 text-sm leading-relaxed text-navy-foreground">{c.value}</p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}