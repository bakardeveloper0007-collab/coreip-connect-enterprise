import { useQuery } from "@tanstack/react-query";

import type { WebsiteSettings } from "@/models";
import { publicQueries } from "@/services/queries";

export const SETTINGS_FALLBACK: WebsiteSettings = {
  contact_info: {
    primary_phone: "+91-120-6618000",
    sales_phone: "+91-120-6618005",
    support_phone: "+91-120-6618000",
    email: "info@coreip.co.in",
    sales_email: "sales@coreip.co.in",
    support_email: "support@coreip.co.in",
    address: "C-421, The iThum, A-40, Sector-62, Noida 201309, Uttar Pradesh, India",
    maps_url: "",
    whatsapp: "",
    business_hours: "Mon – Sat, 9:30 AM – 6:30 PM IST",
  },
  social_links: { linkedin: "", twitter: "", facebook: "", youtube: "" },
  seo_defaults: {
    site_name: "CoreIP",
    default_title: "CoreIP — Unified Communication, Networking & Security Solutions",
    default_description:
      "CoreIP delivers enterprise unified communication, networking, security and hosting solutions.",
    og_image: "",
  },
  homepage: {
    hero_eyebrow: "Enterprise Technology Solutions",
    hero_headline: "Smarter Communication. Stronger Infrastructure.",
    hero_description:
      "CoreIP builds secure, connected and intelligent communication infrastructure for enterprises, institutions and government organisations.",
    hero_image: "",
    hero_primary_cta_label: "Talk to an Expert",
    hero_primary_cta_link: "/contact",
    hero_secondary_cta_label: "Explore Solutions",
    hero_secondary_cta_link: "/solutions",
    show_statistics: true,
    show_partners: true,
    show_testimonials: true,
  },
  cta_labels: {
    talk_to_expert: "Talk to an Expert",
    request_quote: "Request a Quote",
    contact_sales: "Contact Sales",
    request_demo: "Request a Demo",
    download_brochure: "Download Brochure",
    explore_product: "Explore Product",
  },
  footer: {
    tagline:
      "CoreIP helps organisations build secure, connected and intelligent communication infrastructure.",
    blog_url: "https://www.coreip.co.in/blog/",
    privacy_url: "https://www.coreip.co.in/privacy-policy/",
    terms_url: "https://www.coreip.co.in/terms-condition/",
  },
  chatbot: {
    enabled: true,
    title: "CoreIP Assistant",
    greeting:
      "Hi! I can help with CoreIP products, solutions, industries and contact details. What are you looking for?",
    fallback:
      "I don't have that detail. Please share your requirement through the contact form and our team will respond.",
    suggested_questions: [
      "What products does CoreIP offer?",
      "Tell me about your unified communication solutions",
      "Which industries do you serve?",
      "How can I contact your sales team?",
    ],
    use_ai: true,
  },
  navigation: {
    show_products: true,
    show_solutions: true,
    show_industries: true,
    show_projects: true,
    show_team: true,
    max_products_in_menu: 8,
  },
};

/** Merges CMS settings over safe defaults so the UI never renders empty. */
export function useSiteSettings(): WebsiteSettings {
  const { data } = useQuery(publicQueries.settings());

  return {
    contact_info: { ...SETTINGS_FALLBACK.contact_info, ...(data?.contact_info ?? {}) },
    social_links: { ...SETTINGS_FALLBACK.social_links, ...(data?.social_links ?? {}) },
    seo_defaults: { ...SETTINGS_FALLBACK.seo_defaults, ...(data?.seo_defaults ?? {}) },
    homepage: { ...SETTINGS_FALLBACK.homepage, ...(data?.homepage ?? {}) },
    cta_labels: { ...SETTINGS_FALLBACK.cta_labels, ...(data?.cta_labels ?? {}) },
    footer: { ...SETTINGS_FALLBACK.footer, ...(data?.footer ?? {}) },
    chatbot: { ...SETTINGS_FALLBACK.chatbot, ...(data?.chatbot ?? {}) },
    navigation: { ...SETTINGS_FALLBACK.navigation, ...(data?.navigation ?? {}) },
  };
}