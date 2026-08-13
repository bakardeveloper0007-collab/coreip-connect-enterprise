import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Solutions } from "@/components/site/Solutions";
import { Products } from "@/components/site/Products";
import { FeaturedNMS } from "@/components/site/FeaturedNMS";
import { Industries } from "@/components/site/Industries";
import { WhyCoreIP } from "@/components/site/WhyCoreIP";
import { Deployments } from "@/components/site/Deployments";
import { Partners } from "@/components/site/Partners";
import { About } from "@/components/site/About";
import { CTASection } from "@/components/site/CTASection";
import { SiteFooter } from "@/components/site/SiteFooter";

const TITLE = "CoreIP — Unified Communication, Networking & Security Solutions";
const DESCRIPTION =
  "CoreIP delivers enterprise unified communication, IPPBX/VoIP, networking, network management (NMS), security and hosting solutions for businesses, institutions and government organisations in India.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <Solutions />
        <Products />
        <FeaturedNMS />
        <Industries />
        <WhyCoreIP />
        <Deployments />
        <Partners />
        <About />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}
