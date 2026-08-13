import type { ContentStatus } from "@/models";

export interface ListOptions {
  /** Only return published rows (public website). Defaults to true. */
  publishedOnly?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, string | number | boolean | null>;
}

export interface ListResult<T> {
  items: T[];
  total: number;
}

/**
 * Generic content repository contract. Swapping `MockRepository` for
 * `ApiRepository` only requires another implementation of this interface.
 */
export interface ContentRepository<T, TInput = Partial<T>> {
  list(options?: ListOptions): Promise<ListResult<T>>;
  getById(id: string): Promise<T | null>;
  getBySlug?(slug: string, options?: { publishedOnly?: boolean }): Promise<T | null>;
  create(input: TInput): Promise<T>;
  update(id: string, input: TInput): Promise<T>;
  remove(id: string): Promise<void>;
  setStatus?(id: string, status: ContentStatus): Promise<T>;
  count(options?: ListOptions): Promise<number>;
}