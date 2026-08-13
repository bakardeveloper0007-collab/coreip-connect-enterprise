import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminQueries } from "@/services/queries";
import { formatDateTime, humanize } from "@/utils/format";

export const Route = createFileRoute("/admin/logs")({
  component: LogsPage,
});

function LogsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery(adminQueries.logs({ search, limit: 200 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Activity log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every content change made through the admin panel.
        </p>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search action, entity or user…"
        className="max-w-sm"
      />

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Item</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.items.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell>{log.user_email ?? "System"}</TableCell>
                  <TableCell>{humanize(log.action)}</TableCell>
                  <TableCell>
                    {humanize(log.entity)}
                    {log.entity_label ? ` — ${log.entity_label}` : ""}
                  </TableCell>
                </TableRow>
              ))}
              {data && data.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    No activity yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}