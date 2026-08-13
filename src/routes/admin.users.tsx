import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { createStaffUser } from "@/lib/admin-users.functions";
import type { AppRole } from "@/models";
import { ROLE_LABELS, ROLE_PERMISSIONS } from "@/services/auth";
import { grantRole, listStaffAccounts, revokeRole } from "@/services/users";
import { formatDate } from "@/utils/format";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const ALL_ROLES = Object.keys(ROLE_LABELS) as AppRole[];

function CreateUserDialog() {
  const queryClient = useQueryClient();
  const createUser = useServerFn(createStaffUser);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<AppRole[]>(["content_admin"]);

  const mutation = useMutation({
    mutationFn: () => createUser({ data: { email, fullName, password, roles } }),
    onSuccess: () => {
      toast.success("Staff account created");
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
      setOpen(false);
      setEmail("");
      setFullName("");
      setPassword("");
      setRoles(["content_admin"]);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4" /> New staff user
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create staff account</DialogTitle>
          <DialogDescription>
            The account is created with a temporary password — share it securely and ask the user to change it.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div>
            <Label htmlFor="new-name" className="mb-2 block">Full name</Label>
            <Input id="new-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="new-email" className="mb-2 block">Work email</Label>
            <Input id="new-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="new-password" className="mb-2 block">Temporary password</Label>
            <Input
              id="new-password"
              type="text"
              required
              minLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-2 block">Roles</Label>
            <div className="space-y-2 rounded-md border border-border p-3">
              {ALL_ROLES.map((role) => (
                <label key={role} className="flex items-start gap-2.5 text-sm">
                  <Checkbox
                    checked={roles.includes(role)}
                    onCheckedChange={(checked) =>
                      setRoles((prev) =>
                        checked ? [...prev, role] : prev.filter((item) => item !== role),
                      )
                    }
                  />
                  <span>
                    <span className="font-medium text-foreground">{ROLE_LABELS[role]}</span>
                    <span className="block text-xs text-muted-foreground">
                      {ROLE_PERMISSIONS[role].join(", ")}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Create account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UsersPage() {
  const queryClient = useQueryClient();
  const { can, userId } = useAdminAuth();
  const canManage = can("users:manage");

  const staffQuery = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: listStaffAccounts,
    enabled: canManage,
  });

  const toggleRole = useMutation({
    mutationFn: ({
      id,
      role,
      label,
      enabled,
    }: { id: string; role: AppRole; label: string; enabled: boolean }) =>
      enabled ? grantRole(id, role, label) : revokeRole(id, role, label),
    onSuccess: () => {
      toast.success("Roles updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!canManage) {
    return (
      <p className="text-sm text-muted-foreground">
        Only Super Admins can manage users and roles.
      </p>
    );
  }

  const accounts = staffQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Users &amp; roles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create staff accounts and assign the roles that grant admin permissions.
          </p>
        </div>
        <CreateUserDialog />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-sm font-semibold">
          <ShieldCheck className="size-4 text-cyan" /> Role permissions
        </div>
        <ul className="divide-y divide-border text-sm">
          {ALL_ROLES.map((role) => (
            <li key={role} className="flex flex-wrap items-center gap-3 px-5 py-3">
              <span className="w-40 font-medium text-foreground">{ROLE_LABELS[role]}</span>
              <span className="flex flex-wrap gap-1">
                {ROLE_PERMISSIONS[role].map((permission) => (
                  <Badge key={permission} variant="secondary" className="text-[0.65rem]">
                    {permission}
                  </Badge>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">User</th>
              <th className="px-5 py-3 font-semibold">Joined</th>
              {ALL_ROLES.map((role) => (
                <th key={role} className="px-3 py-3 font-semibold">
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {staffQuery.isLoading && (
              <tr>
                <td colSpan={2 + ALL_ROLES.length} className="px-5 py-8 text-center text-muted-foreground">
                  Loading users…
                </td>
              </tr>
            )}
            {!staffQuery.isLoading && accounts.length === 0 && (
              <tr>
                <td colSpan={2 + ALL_ROLES.length} className="px-5 py-8 text-center text-muted-foreground">
                  No accounts yet.
                </td>
              </tr>
            )}
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="px-5 py-3">
                  <p className="font-medium text-foreground">
                    {account.fullName || account.email}
                    {account.id === userId && (
                      <Badge variant="outline" className="ml-2 text-[0.65rem]">You</Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{account.email}</p>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{formatDate(account.createdAt)}</td>
                {ALL_ROLES.map((role) => (
                  <td key={role} className="px-3 py-3">
                    <Switch
                      aria-label={`${ROLE_LABELS[role]} for ${account.email ?? account.id}`}
                      checked={account.roles.includes(role)}
                      disabled={toggleRole.isPending}
                      onCheckedChange={(checked) =>
                        toggleRole.mutate({
                          id: account.id,
                          role,
                          label: account.email ?? account.id,
                          enabled: checked,
                        })
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}