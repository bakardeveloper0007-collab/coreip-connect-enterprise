/**
 * Application service layer.
 *
 * UI code imports ONLY from this module. It never talks to the persistence
 * layer directly, so the repositories below can be swapped for an HTTP/GraphQL
 * implementation without touching a single component.
 */
import { supabase } from "@/integrations/supabase/client";
import type {
  ActivityLog,
  ContactInquiry,
  ContentStatus,
  Faq,
  Industry,
  InquiryStatus,
  KnowledgeArticle,
  MediaAsset,
  Partner,
  ProductCategory,
  ProductWithCategory,
  Project,
  SearchResult,
  Service,
  SettingsKey,
  TeamMember,
  Testimonial,
  WebsiteSettings,
  WebsiteStatistic,
} from "@/models";
import {
  activityLogRepository,
  categoryRepository,
  faqRepository,
  industryRepository,
  inquiryRepository,
  knowledgeRepository,
  mediaRepository,
  partnerRepository,
  productExtras,
  productRepository,
  projectRepository,
  serviceRepository,
  settingsRepository,
  statisticRepository,
  teamRepository,
  testimonialRepository,
} from "./repositories/supabase";
import type { ListOptions } from "./repositories/types";

export const repositories = {
  products: productRepository,
  categories: categoryRepository,
  services: serviceRepository,
  industries: industryRepository,
  projects: projectRepository,
  team: teamRepository,
  partners: partnerRepository,
  testimonials: testimonialRepository,
  faqs: faqRepository,
  knowledge: knowledgeRepository,
  statistics: statisticRepository,
  media: mediaRepository,
  inquiries: inquiryRepository,
  logs: activityLogRepository,
};

export type RepositoryKey = keyof typeof repositories;

/* ------------------------- Public catalogue reads ------------------------- */

export async function getProducts(options: ListOptions = {}): Promise<ProductWithCategory[]> {
  const { items } = await productRepository.list({ orderBy: "sort_order", ...options });
  return items;
}

export async function getProductBySlug(slug: string, publishedOnly = true) {
  return productExtras.getBySlugWithCategory(slug, publishedOnly);
}

export async function getRelatedProducts(ids: string[]) {
  return productExtras.getManyByIds(ids);
}

export async function getCategories(options: ListOptions = {}): Promise<ProductCategory[]> {
  const { items } = await categoryRepository.list(options);
  return items;
}

export async function getCategoryBySlug(slug: string) {
  return categoryRepository.getBySlug!(slug);
}

export async function getServices(options: ListOptions = {}): Promise<Service[]> {
  const { items } = await serviceRepository.list(options);
  return items;
}

export async function getServiceBySlug(slug: string) {
  return serviceRepository.getBySlug!(slug);
}

export async function getIndustries(options: ListOptions = {}): Promise<Industry[]> {
  const { items } = await industryRepository.list(options);
  return items;
}

export async function getIndustryBySlug(slug: string) {
  return industryRepository.getBySlug!(slug);
}

export async function getProjects(options: ListOptions = {}): Promise<Project[]> {
  const { items } = await projectRepository.list(options);
  return items;
}

export async function getProjectBySlug(slug: string) {
  return projectRepository.getBySlug!(slug);
}

export async function getTeamMembers(options: ListOptions = {}): Promise<TeamMember[]> {
  const { items } = await teamRepository.list(options);
  return items;
}

export async function getPartners(options: ListOptions = {}): Promise<Partner[]> {
  const { items } = await partnerRepository.list(options);
  return items;
}

export async function getTestimonials(options: ListOptions = {}): Promise<Testimonial[]> {
  const { items } = await testimonialRepository.list(options);
  return items;
}

export async function getFaqs(options: ListOptions = {}): Promise<Faq[]> {
  const { items } = await faqRepository.list(options);
  return items;
}

export async function getKnowledgeBase(options: ListOptions = {}): Promise<KnowledgeArticle[]> {
  const { items } = await knowledgeRepository.list(options);
  return items;
}

export async function getStatistics(): Promise<WebsiteStatistic[]> {
  const { items } = await statisticRepository.list();
  return items;
}

/* ------------------------------ Settings ------------------------------ */

export async function getWebsiteSettings(): Promise<Partial<WebsiteSettings>> {
  return settingsRepository.getAll();
}

export async function getSetting<K extends SettingsKey>(key: K) {
  return settingsRepository.get(key);
}

export async function updateSetting<K extends SettingsKey>(key: K, value: WebsiteSettings[K]) {
  await settingsRepository.set(key, value);
  await logActivity({ action: "updated", entity: "website_setting", entityLabel: key });
}

/* ------------------------------ Inquiries ------------------------------ */

export interface ContactInquiryInput {
  name: string;
  company?: string;
  phone?: string;
  email: string;
  country?: string;
  requirement_type?: string;
  product_interest?: string;
  service_interest?: string;
  message: string;
  source?: string;
}

export async function submitContactInquiry(input: ContactInquiryInput): Promise<void> {
  const { error } = await supabase.from("contact_inquiries").insert({
    name: input.name,
    company: input.company ?? null,
    phone: input.phone ?? null,
    email: input.email,
    country: input.country ?? null,
    requirement_type: input.requirement_type ?? null,
    product_interest: input.product_interest ?? null,
    service_interest: input.service_interest ?? null,
    message: input.message,
    source: input.source ?? "website",
  });
  if (error) throw new Error(error.message);
}

export async function getInquiries(options: ListOptions = {}) {
  return inquiryRepository.list({ publishedOnly: false, ...options });
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const updated = await inquiryRepository.update(id, { status } as Partial<ContactInquiry>);
  await logActivity({
    action: `marked ${status}`,
    entity: "contact_inquiry",
    entityId: id,
    entityLabel: updated.name,
  });
  return updated;
}

/* --------------------------------- Media --------------------------------- */

const MEDIA_BUCKET = "media";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5; // 5 years

export async function uploadMedia(file: File, altText?: string): Promise<MediaAsset> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${new Date().getFullYear()}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { data: signed, error: signError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError) throw new Error(signError.message);

  const { data: userData } = await supabase.auth.getUser();
  const asset = await mediaRepository.create({
    filename: safeName,
    path,
    url: signed?.signedUrl ?? "",
    alt_text: altText ?? null,
    title: safeName,
    mime_type: file.type,
    size_bytes: file.size,
    uploaded_by: userData.user?.id ?? null,
  } as Partial<MediaAsset>);

  await logActivity({ action: "uploaded", entity: "media_asset", entityId: asset.id, entityLabel: safeName });
  return asset;
}

export async function deleteMedia(asset: MediaAsset): Promise<void> {
  if (asset.path && !asset.path.startsWith("/")) {
    await supabase.storage.from(MEDIA_BUCKET).remove([asset.path]);
  }
  await mediaRepository.remove(asset.id);
  await logActivity({
    action: "deleted",
    entity: "media_asset",
    entityId: asset.id,
    entityLabel: asset.filename,
  });
}

export async function getMediaAssets(options: ListOptions = {}) {
  return mediaRepository.list({ publishedOnly: false, ...options });
}

/* ------------------------------ Activity log ------------------------------ */

export async function logActivity(input: {
  action: string;
  entity: string;
  entityId?: string;
  entityLabel?: string | undefined;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("activity_logs").insert({
      user_id: data.user.id,
      user_email: data.user.email ?? null,
      action: input.action,
      entity: input.entity,
      entity_id: input.entityId ?? null,
      entity_label: input.entityLabel ?? null,
      metadata: (input.metadata ?? {}) as never,
    });
  } catch {
    // Activity logging must never break a content operation.
  }
}

export async function getActivityLogs(options: ListOptions = {}) {
  return activityLogRepository.list({ publishedOnly: false, ...options }) as Promise<{
    items: ActivityLog[];
    total: number;
  }>;
}

/* --------------------------------- Search --------------------------------- */

export async function search(term: string): Promise<SearchResult[]> {
  const query = term.trim();
  if (!query) return [];

  const [products, services, industries, projects, faqs] = await Promise.all([
    getProducts({ search: query, limit: 12 }),
    getServices({ search: query, limit: 12 }),
    getIndustries({ search: query, limit: 8 }),
    getProjects({ search: query, limit: 8 }),
    getFaqs({ search: query, limit: 8 }),
  ]);

  return [
    ...products.map<SearchResult>((p) => ({
      kind: "product",
      title: p.name,
      excerpt: p.short_description ?? "",
      url: productUrl(p),
      image: p.image_url,
    })),
    ...services.map<SearchResult>((s) => ({
      kind: "service",
      title: s.name,
      excerpt: s.short_description ?? "",
      url: `/solutions/${s.slug}`,
      image: s.hero_image_url,
    })),
    ...industries.map<SearchResult>((i) => ({
      kind: "industry",
      title: i.name,
      excerpt: i.description ?? "",
      url: `/industries/${i.slug}`,
      image: i.hero_image_url,
    })),
    ...projects.map<SearchResult>((p) => ({
      kind: "project",
      title: p.title,
      excerpt: p.description ?? "",
      url: `/projects/${p.slug}`,
      image: p.cover_image_url,
    })),
    ...faqs.map<SearchResult>((f) => ({
      kind: "faq",
      title: f.question,
      excerpt: f.answer,
      url: "/faqs",
    })),
  ];
}

export function productUrl(product: {
  slug: string;
  category?: { slug: string } | null;
}): string {
  return `/products/${product.category?.slug ?? "all"}/${product.slug}`;
}

/* ------------------------- Admin dashboard metrics ------------------------- */

export interface DashboardMetrics {
  products: number;
  publishedProducts: number;
  draftProducts: number;
  services: number;
  categories: number;
  projects: number;
  team: number;
  industries: number;
  inquiries: number;
  newInquiries: number;
  knowledge: number;
  media: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const all: ListOptions = { publishedOnly: false };
  const [
    products,
    publishedProducts,
    draftProducts,
    services,
    categories,
    projects,
    team,
    industries,
    inquiries,
    newInquiries,
    knowledge,
    media,
  ] = await Promise.all([
    productRepository.count(all),
    productRepository.count({ publishedOnly: false, filters: { status: "published" } }),
    productRepository.count({ publishedOnly: false, filters: { status: "draft" } }),
    serviceRepository.count(all),
    categoryRepository.count(all),
    projectRepository.count(all),
    teamRepository.count(all),
    industryRepository.count(all),
    inquiryRepository.count(all),
    inquiryRepository.count({ publishedOnly: false, filters: { status: "new" } }),
    knowledgeRepository.count(all),
    mediaRepository.count(all),
  ]);

  return {
    products,
    publishedProducts,
    draftProducts,
    services,
    categories,
    projects,
    team,
    industries,
    inquiries,
    newInquiries,
    knowledge,
    media,
  };
}

export async function setContentStatus(
  key: RepositoryKey,
  id: string,
  status: ContentStatus,
  label?: string,
) {
  const repo = repositories[key];
  if (!repo.setStatus) throw new Error("This content type does not support status changes");
  const result = await repo.setStatus(id, status);
  await logActivity({ action: status === "published" ? "published" : `set ${status}`, entity: key, entityId: id, entityLabel: label });
  return result;
}