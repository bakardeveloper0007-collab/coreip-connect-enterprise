import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/models";

/**
 * Authentication service. Backed by Lovable Cloud auth today; the surface is
 * intentionally small so another identity provider can be dropped in.
 */
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  async getRoles(): Promise<AppRole[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    if (error) return [];
    return (data ?? []).map((row) => row.role as AppRole);
  },
};

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  content_admin: "Content Admin",
  product_manager: "Product Manager",
  sales_manager: "Sales Manager",
  support_admin: "Support Admin",
};

/** Permission matrix — the single source of truth for admin capabilities. */
export type Permission =
  | "content:manage"
  | "products:manage"
  | "leads:view"
  | "leads:manage"
  | "media:manage"
  | "settings:manage"
  | "chatbot:manage"
  | "users:manage"
  | "logs:view";

const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  super_admin: [
    "content:manage",
    "products:manage",
    "leads:view",
    "leads:manage",
    "media:manage",
    "settings:manage",
    "chatbot:manage",
    "users:manage",
    "logs:view",
  ],
  content_admin: ["content:manage", "products:manage", "media:manage", "settings:manage", "chatbot:manage", "logs:view"],
  product_manager: ["products:manage", "content:manage", "media:manage", "logs:view"],
  sales_manager: ["leads:view", "leads:manage", "logs:view"],
  support_admin: ["leads:view", "chatbot:manage", "logs:view"],
};

export function permissionsForRoles(roles: AppRole[]): Set<Permission> {
  const set = new Set<Permission>();
  for (const role of roles) {
    for (const permission of ROLE_PERMISSIONS[role] ?? []) set.add(permission);
  }
  return set;
}