import { supabase } from "@/integrations/supabase/client";
import type { ContentStatus } from "@/models";
import type { ContentRepository, ListOptions, ListResult } from "../types";

type AnyRow = Record<string, unknown>;

export interface RepositoryConfig {
  table: string;
  /** Columns to select. Supports embedded relations. */
  select?: string;
  /** Column used for free-text search (ilike). */
  searchColumns?: string[];
  defaultOrderBy?: string;
  defaultAscending?: boolean;
  /** Column that gates public visibility. */
  statusColumn?: "status" | "enabled" | null;
  slugColumn?: string;
}

function client() {
  // Cast keeps the repository generic over table names while remaining the
  // single place that knows about the persistence technology.
  return supabase as unknown as {
    from: (table: string) => any;
  };
}

export function createContentRepository<T>(
  config: RepositoryConfig,
): ContentRepository<T> & { config: RepositoryConfig } {
  const {
    table,
    select = "*",
    searchColumns = [],
    defaultOrderBy = "sort_order",
    defaultAscending = true,
    statusColumn = "status",
    slugColumn = "slug",
  } = config;

  function applyVisibility(query: any, publishedOnly: boolean) {
    if (!publishedOnly || !statusColumn) return query;
    if (statusColumn === "enabled") return query.eq("enabled", true);
    return query.eq("status", "published");
  }

  function applyOptions(query: any, options: ListOptions = {}) {
    const { search, filters, orderBy, ascending } = options;
    query = applyVisibility(query, options.publishedOnly ?? true);

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value === null || value === undefined || value === "") continue;
        query = query.eq(key, value);
      }
    }
    if (search && searchColumns.length > 0) {
      const term = search.replace(/[%,()]/g, " ").trim();
      if (term) {
        query = query.or(searchColumns.map((c) => `${c}.ilike.%${term}%`).join(","));
      }
    }
    query = query.order(orderBy ?? defaultOrderBy, {
      ascending: ascending ?? defaultAscending,
    });
    return query;
  }

  return {
    config,

    async list(options: ListOptions = {}): Promise<ListResult<T>> {
      let query = client().from(table).select(select, { count: "exact" });
      query = applyOptions(query, options);
      if (options.limit != null) {
        const from = options.offset ?? 0;
        query = query.range(from, from + options.limit - 1);
      }
      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { items: (data ?? []) as T[], total: count ?? (data?.length ?? 0) };
    },

    async count(options: ListOptions = {}): Promise<number> {
      let query = client().from(table).select("id", { count: "exact", head: true });
      query = applyVisibility(query, options.publishedOnly ?? true);
      if (options.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          if (value === null || value === undefined || value === "") continue;
          query = query.eq(key, value);
        }
      }
      const { count, error } = await query;
      if (error) throw new Error(error.message);
      return count ?? 0;
    },

    async getById(id: string): Promise<T | null> {
      const { data, error } = await client()
        .from(table)
        .select(select)
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as T) ?? null;
    },

    async getBySlug(slug: string, options?: { publishedOnly?: boolean }): Promise<T | null> {
      let query = client().from(table).select(select).eq(slugColumn, slug);
      query = applyVisibility(query, options?.publishedOnly ?? true);
      const { data, error } = await query.maybeSingle();
      if (error) throw new Error(error.message);
      return (data as T) ?? null;
    },

    async create(input: Partial<T>): Promise<T> {
      const { data, error } = await client()
        .from(table)
        .insert(input as AnyRow)
        .select(select)
        .single();
      if (error) throw new Error(error.message);
      return data as T;
    },

    async update(id: string, input: Partial<T>): Promise<T> {
      const { data, error } = await client()
        .from(table)
        .update(input as AnyRow)
        .eq("id", id)
        .select(select)
        .single();
      if (error) throw new Error(error.message);
      return data as T;
    },

    async remove(id: string): Promise<void> {
      const { error } = await client().from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },

    async setStatus(id: string, status: ContentStatus): Promise<T> {
      const { data, error } = await client()
        .from(table)
        .update({ status })
        .eq("id", id)
        .select(select)
        .single();
      if (error) throw new Error(error.message);
      return data as T;
    },
  };
}