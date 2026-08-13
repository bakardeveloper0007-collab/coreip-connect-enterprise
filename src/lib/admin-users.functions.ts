import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ROLES = [
  "super_admin",
  "content_admin",
  "product_manager",
  "sales_manager",
  "support_admin",
] as const;

type Role = (typeof ROLES)[number];

/**
 * Creates a staff account and grants its initial roles. Only Super Admins may
 * call this — the check runs against the caller's own (RLS-scoped) client.
 */
export const createStaffUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { email: string; password: string; fullName?: string; roles: string[] }) => {
    const email = String(data.email ?? "").trim().toLowerCase();
    const password = String(data.password ?? "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("A valid email is required");
    if (password.length < 10) throw new Error("Password must be at least 10 characters");
    const roles = (data.roles ?? []).filter((role): role is Role =>
      (ROLES as readonly string[]).includes(role),
    );
    if (roles.length === 0) throw new Error("Select at least one role");
    return { email, password, fullName: String(data.fullName ?? "").trim(), roles };
  })
  .handler(async ({ data, context }) => {
    const { data: isSuperAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isSuperAdmin) throw new Error("Only Super Admins can create staff accounts");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const created = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: data.fullName ? { full_name: data.fullName } : undefined,
    });
    if (created.error || !created.data.user) {
      throw new Error(created.error?.message ?? "Could not create the account");
    }

    const userId = created.data.user.id;
    const { error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .insert(data.roles.map((role) => ({ user_id: userId, role })));
    if (rolesError) throw new Error(rolesError.message);

    return { id: userId, email: data.email };
  });