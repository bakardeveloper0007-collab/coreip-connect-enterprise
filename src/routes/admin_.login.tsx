import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { denied?: boolean } =>
    search["denied"] === true || search["denied"] === "true" ? { denied: true } : {},
  head: () => ({
    meta: [
      { title: "Sign in — CoreIP Admin" },
      { name: "description", content: "Sign in to the CoreIP content management system." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { denied } = Route.useSearch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.signIn(email.trim(), password);
      const roles = await authService.getRoles();
      if (roles.length === 0) {
        await authService.signOut();
        setError("This account does not have admin access.");
        return;
      }
      await router.navigate({ to: "/admin", replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[image:var(--gradient-navy)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[image:var(--gradient-brand)] font-display text-sm font-bold text-cyan-foreground">
            CI
          </span>
          <span className="font-display text-lg font-bold">
            CORE<span className="text-cyan">IP</span>
          </span>
        </div>
        <h1 className="mt-6 font-display text-xl font-bold text-foreground">Admin sign in</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage products, content, media and leads.
        </p>

        {denied && (
          <Alert className="mt-5">
            <AlertDescription>
              Your account is signed in but has no admin role assigned.
            </AlertDescription>
          </Alert>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="mb-1.5 block">
              Work email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-1.5 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={200}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}