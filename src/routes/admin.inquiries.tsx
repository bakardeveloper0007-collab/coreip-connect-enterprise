import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { InquiryStatus } from "@/models";
import { updateInquiryStatus } from "@/services/api";
import { adminQueries } from "@/services/queries";
import { formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/admin/inquiries")({
  component: InquiriesPage,
});

const STATUSES: InquiryStatus[] = [
  "new",
  "contacted",
  "in_progress",
  "qualified",
  "closed",
  "spam",
];

function InquiriesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    adminQueries.inquiries({
      search,
      limit: 200,
      ...(status === "all" ? {} : { filters: { status } }),
    }),
  );

  const update = useMutation({
    mutationFn: ({ id, next }: { id: string; next: InquiryStatus }) =>
      updateInquiryStatus(id, next),
    onSuccess: () => {
      toast.success("Lead updated");
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Inquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Leads captured from contact, quote and product enquiry forms.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, company…"
          className="max-w-sm"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {value.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <Skeleton className="h-40 w-full" />}

      <ul className="space-y-3">
        {data?.items.map((inquiry) => (
          <li key={inquiry.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-base font-semibold text-foreground">
                    {inquiry.name}
                  </p>
                  <Badge variant={inquiry.status === "new" ? "default" : "secondary"}>
                    {inquiry.status.replace(/_/g, " ")}
                  </Badge>
                  {inquiry.source && <Badge variant="outline">{inquiry.source}</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {inquiry.company ? `${inquiry.company} · ` : ""}
                  <a href={`mailto:${inquiry.email}`} className="hover:text-foreground">
                    {inquiry.email}
                  </a>
                  {inquiry.phone ? (
                    <>
                      {" · "}
                      <a href={`tel:${inquiry.phone}`} className="hover:text-foreground">
                        {inquiry.phone}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
              <Select
                value={inquiry.status}
                onValueChange={(next) =>
                  update.mutate({ id: inquiry.id, next: next as InquiryStatus })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-foreground">{inquiry.message}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {[inquiry.requirement_type, inquiry.product_interest, inquiry.service_interest]
                .filter(Boolean)
                .join(" · ")}
              {inquiry.requirement_type || inquiry.product_interest || inquiry.service_interest
                ? " · "
                : ""}
              {formatDateTime(inquiry.created_at)}
            </p>
          </li>
        ))}
        {data && data.items.length === 0 && !isLoading && (
          <li className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No inquiries match this filter.
          </li>
        )}
      </ul>
    </div>
  );
}