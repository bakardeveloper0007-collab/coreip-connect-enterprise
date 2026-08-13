import { supabase } from "@/integrations/supabase/client";
import type {
  ActivityLog,
  ContactInquiry,
  Faq,
  Industry,
  KnowledgeArticle,
  MediaAsset,
  Partner,
  Product,
  ProductCategory,
  ProductWithCategory,
  Project,
  Service,
  SettingsKey,
  TeamMember,
  Testimonial,
  WebsiteSettings,
  WebsiteStatistic,
} from "@/models";
import { createContentRepository } from "./contentRepository";

const PRODUCT_SELECT = "*, category:product_categories(id,name,slug)";

export const productRepository = createContentRepository<ProductWithCategory>({
  table: "products",
  select: PRODUCT_SELECT,
  searchColumns: ["name", "short_description", "long_description"],
});

export const categoryRepository = createContentRepository<ProductCategory>({
  table: "product_categories",
  searchColumns: ["name", "description"],
  statusColumn: "enabled",
});

export const serviceRepository = createContentRepository<Service>({
  table: "services",
  searchColumns: ["name", "short_description", "long_description"],
});

export const industryRepository = createContentRepository<Industry>({
  table: "industries",
  searchColumns: ["name", "description"],
});

export const projectRepository = createContentRepository<Project>({
  table: "projects",
  searchColumns: ["title", "customer", "description", "solution"],
});

export const teamRepository = createContentRepository<TeamMember>({
  table: "team_members",
  searchColumns: ["name", "designation", "department"],
});

export const partnerRepository = createContentRepository<Partner>({
  table: "partners",
  searchColumns: ["name"],
});

export const testimonialRepository = createContentRepository<Testimonial>({
  table: "testimonials",
  searchColumns: ["author_name", "organisation", "quote"],
});

export const faqRepository = createContentRepository<Faq>({
  table: "faqs",
  searchColumns: ["question", "answer", "category"],
});

export const knowledgeRepository = createContentRepository<KnowledgeArticle>({
  table: "knowledge_articles",
  searchColumns: ["title", "content", "category"],
  defaultOrderBy: "created_at",
  defaultAscending: false,
});

export const statisticRepository = createContentRepository<WebsiteStatistic>({
  table: "website_statistics",
  searchColumns: ["label"],
  statusColumn: "enabled",
});

export const mediaRepository = createContentRepository<MediaAsset>({
  table: "media_assets",
  searchColumns: ["filename", "title", "alt_text"],
  defaultOrderBy: "created_at",
  defaultAscending: false,
  statusColumn: null,
});

export const inquiryRepository = createContentRepository<ContactInquiry>({
  table: "contact_inquiries",
  searchColumns: ["name", "email", "company", "message", "product_interest"],
  defaultOrderBy: "created_at",
  defaultAscending: false,
  statusColumn: null,
});

export const activityLogRepository = createContentRepository<ActivityLog>({
  table: "activity_logs",
  searchColumns: ["action", "entity", "entity_label", "user_email"],
  defaultOrderBy: "created_at",
  defaultAscending: false,
  statusColumn: null,
});

/* ---------------- Settings ---------------- */

export const settingsRepository = {
  async getAll(): Promise<Partial<WebsiteSettings>> {
    const { data, error } = await supabase.from("website_settings").select("key,value");
    if (error) throw new Error(error.message);
    const result: Record<string, unknown> = {};
    for (const row of data ?? []) result[row.key] = row.value;
    return result as Partial<WebsiteSettings>;
  },

  async get<K extends SettingsKey>(key: K): Promise<WebsiteSettings[K] | null> {
    const { data, error } = await supabase
      .from("website_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data?.value as unknown as WebsiteSettings[K]) ?? null;
  },

  async set<K extends SettingsKey>(key: K, value: WebsiteSettings[K]): Promise<void> {
    const { error } = await supabase
      .from("website_settings")
      .upsert({ key, value: value as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
  },
};

/* ---------------- Product helpers ---------------- */

export const productExtras = {
  async getBySlugWithCategory(
    slug: string,
    publishedOnly = true,
  ): Promise<ProductWithCategory | null> {
    return productRepository.getBySlug!(slug, { publishedOnly });
  },

  async getManyByIds(ids: string[]): Promise<ProductWithCategory[]> {
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .in("id", ids)
      .eq("status", "published");
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as ProductWithCategory[];
  },
};

export type { Product };