import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminQueries } from "@/services/queries";
import { formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | undefined;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {value === undefined ? (
        <Skeleton className="mt-3 h-8 w-16" />
      ) : (
        <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
      )}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AdminDashboard() {
  const { email, roles, can } = useAdminAuth();
  const metrics = useQuery(adminQueries.metrics());
  const logs = useQuery(adminQueries.logs({ limit: 8 }));
  const inquiries = useQuery({
    ...adminQueries.inquiries({ limit: 5 }),
    enabled: can("leads:view"),
  });

  const m = metrics.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {email ?? "admin"}
          {roles.length > 0 ? ` · ${roles.length} role${roles.length > 1 ? "s" : ""}` : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Products"
          value={m?.products}
          hint={m ? `${m.publishedProducts} published · ${m.draftProducts} draft` : undefined}
        />
        <MetricCard label="Solutions" value={m?.services} hint={m ? `${m.categories} categories` : undefined} />
        <MetricCard label="Projects" value={m?.projects} hint={m ? `${m.industries} industries` : undefined} />
        <MetricCard
          label="Inquiries"
          value={m?.inquiries}
          hint={m ? `${m.newInquiries} new` : undefined}
        />
        <MetricCard label="Team members" value={m?.team} />
        <MetricCard label="Knowledge articles" value={m?.knowledge} hint="Used by the assistant" />
        <MetricCard label="Media assets" value={m?.media} />
        <MetricCard label="Categories" value={m?.categories} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent activity</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/logs">View all</Link>
            </Button>
          </div>
          <ul className="mt-4 space-y-3">
            {logs.isLoading && <Skeleton className="h-20 w-full" />}
            {logs.data?.items.map((log) => (
              <li key={log.id} className="text-sm">
                <p className="text-foreground">
                  <span className="font-medium">{log.user_email ?? "System"}</span> {log.action}{" "}
                  {log.entity.replace(/_/g, " ")}
                  {log.entity_label ? ` — ${log.entity_label}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">{formatDateTime(log.created_at)}</p>
              </li>
            ))}
            {logs.data && logs.data.items.length === 0 && (
              <li className="text-sm text-muted-foreground">No activity recorded yet.</li>
            )}
          </ul>
        </section>

        {can("leads:view") && (
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Latest inquiries</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/inquiries">View all</Link>
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {inquiries.isLoading && <Skeleton className="h-20 w-full" />}
              {inquiries.data?.items.map((inquiry) => (
                <li key={inquiry.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{inquiry.name}</p>
                    <Badge variant="secondary">{inquiry.status}</Badge>
                  </div>
                  <p className="line-clamp-1 text-muted-foreground">{inquiry.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(inquiry.created_at)}</p>
                </li>
              ))}
              {inquiries.data && inquiries.data.items.length === 0 && (
                <li className="text-sm text-muted-foreground">No inquiries yet.</li>
              )}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}