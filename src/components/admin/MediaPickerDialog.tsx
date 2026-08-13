import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { uploadMedia } from "@/services/api";
import { adminQueries } from "@/services/queries";

export function MediaPickerDialog({
  onSelect,
  trigger,
}: {
  onSelect: (url: string) => void;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    ...adminQueries.media({ search, limit: 60 }),
    enabled: open,
  });

  const upload = useMutation({
    mutationFn: (file: File) => uploadMedia(file),
    onSuccess: (asset) => {
      toast.success("Uploaded");
      queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      onSelect(asset.url);
      setOpen(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media library</DialogTitle>
          <DialogDescription>Choose an existing asset or upload a new one.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media"
          />
          <input
            ref={fileInput}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload.mutate(file);
            }}
          />
          <Button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={upload.isPending}
          >
            {upload.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Upload
          </Button>
        </div>
        <div className="grid max-h-[55vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {data?.items.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => {
                onSelect(asset.url);
                setOpen(false);
              }}
              className="group overflow-hidden rounded-lg border border-border text-left transition-colors hover:border-primary"
            >
              <div className="aspect-square bg-muted">
                {asset.mime_type?.startsWith("image/") ? (
                  <img
                    src={asset.url}
                    alt={asset.alt_text ?? asset.filename}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs text-muted-foreground">
                    Document
                  </div>
                )}
              </div>
              <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">{asset.filename}</p>
            </button>
          ))}
          {data && data.items.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground">No media yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}