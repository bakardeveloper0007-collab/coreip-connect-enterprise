import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/models";
import { authService, permissionsForRoles, type Permission } from "@/services/auth";

export function useAdminSession() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return { userId, email, ready };
}

export function useAdminAuth() {
  const session = useAdminSession();
  const rolesQuery = useQuery({
    queryKey: ["admin", "roles", session.userId],
    queryFn: () => authService.getRoles(),
    enabled: session.ready && !!session.userId,
    staleTime: 60_000,
  });

  const roles: AppRole[] = rolesQuery.data ?? [];
  const permissions = permissionsForRoles(roles);

  return {
    ...session,
    roles,
    isStaff: roles.length > 0,
    loading: !session.ready || rolesQuery.isLoading,
    can: (permission: Permission) => permissions.has(permission),
  };
}