import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { MediaAsset } from "@/models";
import { deleteMedia, uploadMedia } from "@/services/api";
import { adminQueries } from "@/services/queries";
import { formatBytes } from "@/utils/format";

export const Route = createFileRoute("/admin/media")({
  component: MediaPage,
});

function MediaPage() {
  const [search, setSearch] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminQueries.media({ search, limit: 200 }));

  const upload = useMutation({
    mutationFn: (files: File[]) => Promise.all(files.map((file) => uploadMedia(file))),
    onSuccess: () => {
      toast.success("Upload complete");
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: (asset: MediaAsset) => deleteMedia(asset),
    onSuccess: () => {
      toast.success("Asset deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Media library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Images and brochures used across products, solutions and pages.
          </p>
        </div>
        <div>
          <input
            ref={fileInput}
            type="file"
            multiple
            className="hidden"
            accept="image/*,application/pdf"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length) upload.mutate(files);
            }}
          />
          <Button onClick={() => fileInput.current?.click()} disabled={upload.isPending}>
            {upload.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Upload files
          </Button>
        </div>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search media…"
        className="max-w-sm"
      />

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data?.items.map((asset) => (
            <figure key={asset.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-square bg-muted">
                {asset.mime_type?.startsWith("image/") ? (
                  <img
                    src={asset.url}
                    alt={asset.alt_text ?? asset.filename}
                    loading="lazy"
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-muted-foreground">
                    Document
                  </div>
                )}
              </div>
              <figcaption className="space-y-1 p-3">
                <p className="truncate text-sm font-medium text-foreground">{asset.filename}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(asset.size_bytes)}</p>
                <div className="flex gap-1 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(asset.url);
                      toast.success("URL copied");
                    }}
                  >
                    <Copy className="size-3.5" /> Copy URL
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete asset"
                    onClick={() => remove.mutate(asset)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </figcaption>
            </figure>
          ))}
          {data && data.items.length === 0 && (
            <p className="text-sm text-muted-foreground">No media uploaded yet.</p>
          )}
        </div>
      )}
    </div>
  );
}