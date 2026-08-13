import { queryOptions } from "@tanstack/react-query";

import * as api from "./api";
import type { ListOptions } from "./repositories/types";

export const publicQueries = {
  settings: () =>
    queryOptions({
      queryKey: ["settings"],
      queryFn: () => api.getWebsiteSettings(),
      staleTime: 5 * 60_000,
    }),
  statistics: () =>
    queryOptions({ queryKey: ["statistics"], queryFn: () => api.getStatistics() }),
  categories: () =>
    queryOptions({ queryKey: ["categories"], queryFn: () => api.getCategories() }),
  products: (options: ListOptions = {}) =>
    queryOptions({
      queryKey: ["products", options],
      queryFn: () => api.getProducts(options),
    }),
  services: (options: ListOptions = {}) =>
    queryOptions({
      queryKey: ["services", options],
      queryFn: () => api.getServices(options),
    }),
  industries: (options: ListOptions = {}) =>
    queryOptions({
      queryKey: ["industries", options],
      queryFn: () => api.getIndustries(options),
    }),
  projects: (options: ListOptions = {}) =>
    queryOptions({
      queryKey: ["projects", options],
      queryFn: () => api.getProjects(options),
    }),
  team: (options: ListOptions = {}) =>
    queryOptions({ queryKey: ["team", options], queryFn: () => api.getTeamMembers(options) }),
  partners: () => queryOptions({ queryKey: ["partners"], queryFn: () => api.getPartners() }),
  testimonials: () =>
    queryOptions({ queryKey: ["testimonials"], queryFn: () => api.getTestimonials() }),
  faqs: (options: ListOptions = {}) =>
    queryOptions({ queryKey: ["faqs", options], queryFn: () => api.getFaqs(options) }),
  search: (term: string) =>
    queryOptions({
      queryKey: ["search", term],
      queryFn: () => api.search(term),
      enabled: term.trim().length > 1,
    }),
};

export const adminQueries = {
  metrics: () =>
    queryOptions({ queryKey: ["admin", "metrics"], queryFn: () => api.getDashboardMetrics() }),
  inquiries: (options: ListOptions = {}) =>
    queryOptions({
      queryKey: ["admin", "inquiries", options],
      queryFn: () => api.getInquiries(options),
    }),
  logs: (options: ListOptions = {}) =>
    queryOptions({
      queryKey: ["admin", "logs", options],
      queryFn: () => api.getActivityLogs(options),
    }),
  media: (options: ListOptions = {}) =>
    queryOptions({
      queryKey: ["admin", "media", options],
      queryFn: () => api.getMediaAssets(options),
    }),
  resource: (key: api.RepositoryKey, options: ListOptions = {}) =>
    queryOptions({
      queryKey: ["admin", "resource", key, options],
      queryFn: async () => {
        const repo = api.repositories[key] as {
          list: (o: ListOptions) => Promise<{ items: Record<string, unknown>[]; total: number }>;
        };
        return repo.list({ publishedOnly: false, ...options });
      },
    }),
};