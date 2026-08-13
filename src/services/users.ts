import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/models";
import { logActivity } from "@/services/api";

export interface StaffAccount {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  roles: AppRole[];
}

export async function listStaffAccounts(): Promise<StaffAccount[]> {
  const { data, error } = await supabase.rpc("list_staff_accounts");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    roles: (row.roles ?? []) as AppRole[],
  }));
}

export async function grantRole(userId: string, role: AppRole, label: string) {
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
  if (error) throw new Error(error.message);
  await logActivity({ action: `granted ${role}`, entity: "user_role", entityId: userId, entityLabel: label });
}

export async function revokeRole(userId: string, role: AppRole, label: string) {
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role);
  if (error) throw new Error(error.message);
  await logActivity({ action: `revoked ${role}`, entity: "user_role", entityId: userId, entityLabel: label });
}