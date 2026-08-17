/**
 * Domain models for the CoreIP platform.
 *
 * These are database-ready, normalized interfaces. They intentionally do NOT
 * depend on Supabase types so the persistence layer can be replaced (REST API,
 * GraphQL, another database) without touching the UI.
 */

export type ContentStatus = "draft" | "published" | "archived";

export type AppRole =
  | "super_admin"
  | "content_admin"
  | "product_manager"
  | "sales_manager"
  | "support_admin";

export type InquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "qualified"
  | "closed"
  | "spam";

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductCategory extends Timestamps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  group_name: string;
  sort_order: number;
  enabled: boolean;
  seo_title: string | null;
  seo_description: string | null;
}

export interface Product extends Timestamps {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  short_description: string | null;
  long_description: string | null;
  image_url: string | null;
  gallery: string[];
  features: string[];
  benefits: string[];
  applications: string[];
  specifications: ProductSpecification[];
  brochure_url: string | null;
  datasheet_access: "public" | "gated";
  video_url: string | null;
  model_3d_url: string | null;
  related_product_ids: string[];
  cta_text: string | null;
  cta_link: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: ContentStatus;
  sort_order: number;
  is_hot: boolean;
}

export interface ProductWithCategory extends Product {
  category: Pick<ProductCategory, "id" | "name" | "slug"> | null;
}

export interface Service extends Timestamps {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  icon: string | null;
  short_description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  gallery: string[];
  features: string[];
  benefits: string[];
  applications: string[];
  video_url: string | null;
  related_product_ids: string[];
  cta_text: string | null;
  cta_link: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: ContentStatus;
  sort_order: number;
  featured: boolean;
}

export interface Industry extends Timestamps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  icon: string | null;
  highlights: string[];
  seo_title: string | null;
  seo_description: string | null;
  status: ContentStatus;
  sort_order: number;
}

export interface Project extends Timestamps {
  id: string;
  title: string;
  slug: string;
  customer: string | null;
  industry_id: string | null;
  location: string | null;
  solution: string | null;
  description: string | null;
  highlights: string[];
  technologies: string[];
  cover_image_url: string | null;
  gallery: string[];
  case_study_url: string | null;
  project_date: string | null;
  cta_text: string | null;
  cta_link: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: ContentStatus;
  sort_order: number;
}

export interface TeamMember extends Timestamps {
  id: string;
  name: string;
  designation: string | null;
  department: string | null;
  profile_image_url: string | null;
  short_bio: string | null;
  email: string | null;
  linkedin_url: string | null;
  social_links: Record<string, string>;
  sort_order: number;
  status: ContentStatus;
}

export interface Partner extends Timestamps {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  sort_order: number;
  status: ContentStatus;
}

export interface Testimonial extends Timestamps {
  id: string;
  author_name: string;
  author_title: string | null;
  organisation: string | null;
  quote: string;
  avatar_url: string | null;
  sort_order: number;
  status: ContentStatus;
}

export interface Faq extends Timestamps {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  related_product_id: string | null;
  related_service_id: string | null;
  sort_order: number;
  status: ContentStatus;
}

export interface KnowledgeArticle extends Timestamps {
  id: string;
  title: string;
  category: string | null;
  content: string;
  keywords: string[];
  related_product_id: string | null;
  related_service_id: string | null;
  link_url: string | null;
  link_label: string | null;
  status: ContentStatus;
}

export interface MediaAsset extends Timestamps {
  id: string;
  filename: string;
  path: string;
  url: string;
  alt_text: string | null;
  title: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
}

export interface ContactInquiry extends Timestamps {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string;
  country: string | null;
  requirement_type: string | null;
  product_interest: string | null;
  service_interest: string | null;
  message: string;
  source: string | null;
  status: InquiryStatus;
  assigned_to: string | null;
  internal_notes: string | null;
}

export interface WebsiteStatistic extends Timestamps {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  icon: string | null;
  sort_order: number;
  enabled: boolean;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  entity_label: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

/* ---------- Website settings (typed groups) ---------- */

export interface ContactInfo {
  primary_phone: string;
  sales_phone: string;
  support_phone: string;
  email: string;
  sales_email: string;
  support_email: string;
  address: string;
  maps_url: string;
  whatsapp: string;
  business_hours: string;
}

export interface SocialLinks {
  linkedin: string;
  twitter: string;
  facebook: string;
  youtube: string;
}

export interface SeoDefaults {
  site_name: string;
  default_title: string;
  default_description: string;
  og_image: string;
}

export interface HomepageSettings {
  hero_eyebrow: string;
  hero_headline: string;
  hero_description: string;
  hero_image: string;
  hero_primary_cta_label: string;
  hero_primary_cta_link: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_link: string;
  show_statistics: boolean;
  show_partners: boolean;
  show_testimonials: boolean;
}

export interface CtaLabels {
  talk_to_expert: string;
  request_quote: string;
  contact_sales: string;
  request_demo: string;
  download_brochure: string;
  explore_product: string;
}

export interface FooterSettings {
  tagline: string;
  blog_url: string;
  privacy_url: string;
  terms_url: string;
}

export interface ChatbotSettings {
  enabled: boolean;
  title: string;
  greeting: string;
  fallback: string;
  suggested_questions: string[];
  use_ai: boolean;
}

export interface NavigationSettings {
  show_products: boolean;
  show_solutions: boolean;
  show_industries: boolean;
  show_projects: boolean;
  show_team: boolean;
  max_products_in_menu: number;
}

export interface WebsiteSettings {
  contact_info: ContactInfo;
  social_links: SocialLinks;
  seo_defaults: SeoDefaults;
  homepage: HomepageSettings;
  cta_labels: CtaLabels;
  footer: FooterSettings;
  chatbot: ChatbotSettings;
  navigation: NavigationSettings;
}

export type SettingsKey = keyof WebsiteSettings;

/* ---------- Chatbot ---------- */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  links?: { label: string; url: string }[];
  createdAt: string;
}

export interface ChatAnswer {
  content: string;
  links: { label: string; url: string }[];
  grounded: boolean;
}

/* ---------- Search ---------- */

export type SearchResultKind =
  | "product"
  | "service"
  | "industry"
  | "project"
  | "faq";

export interface SearchResult {
  kind: SearchResultKind;
  title: string;
  excerpt: string;
  url: string;
  image?: string | null;
}