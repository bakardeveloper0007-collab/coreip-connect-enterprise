import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MediaPickerDialog } from "./MediaPickerDialog";
import { KeyValueInput, TagListInput, type KeyValueItem } from "./TagListInput";
import { buildDefaults, type FieldDef } from "./fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { logActivity, repositories, type RepositoryKey } from "@/services/api";
import { publicQueries } from "@/services/queries";
import { slugify } from "@/utils/slug";

export function ResourceForm({
  resource,
  fields,
  record,
  titleField = "name",
  onDone,
}: {
  resource: RepositoryKey;
  fields: FieldDef[];
  record?: Record<string, unknown> | null;
  titleField?: string;
  onDone: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    buildDefaults(fields, record),
  );
  const queryClient = useQueryClient();

  const categories = useQuery({ ...publicQueries.categories(), enabled: true });
  const products = useQuery(publicQueries.products({ publishedOnly: false, limit: 200 }));
  const services = useQuery(publicQueries.services({ publishedOnly: false, limit: 200 }));
  const industries = useQuery(publicQueries.industries({ publishedOnly: false, limit: 200 }));

  const groups = useMemo(() => {
    const map = new Map<string, FieldDef[]>();
    for (const field of fields) {
      const key = field.group ?? "General";
      map.set(key, [...(map.get(key) ?? []), field]);
    }
    return [...map.entries()];
  }, [fields]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = { ...values };
      for (const field of fields) {
        if (field.type === "slug" && !payload[field.name]) {
          payload[field.name] = slugify(String(values[field.sourceField ?? titleField] ?? ""));
        }
        if ((field.type === "text" || field.type === "url" || field.type === "email" || field.type === "image" || field.type === "file" || field.type === "date") && payload[field.name] === "") {
          payload[field.name] = null;
        }
      }
      const repo = repositories[resource] as unknown as {
        create: (input: Record<string, unknown>) => Promise<{ id: string }>;
        update: (id: string, input: Record<string, unknown>) => Promise<{ id: string }>;
      };
      const label = String(values[titleField] ?? "");
      if (record?.["id"]) {
        await repo.update(String(record["id"]), payload);
        await logActivity({ action: "updated", entity: resource, entityId: String(record["id"]), entityLabel: label });
      } else {
        const created = await repo.create(payload);
        await logActivity({ action: "created", entity: resource, entityId: created.id, entityLabel: label });
      }
    },
    onSuccess: () => {
      toast.success(record?.["id"] ? "Changes saved" : "Created successfully");
      queryClient.invalidateQueries();
      onDone();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function set(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function resolveOptions(field: FieldDef) {
    if (field.options) return field.options;
    switch (field.optionsSource) {
      case "categories":
        return (categories.data ?? []).map((c) => ({ label: c.name, value: c.id }));
      case "products":
        return (products.data ?? []).map((p) => ({ label: p.name, value: p.id }));
      case "services":
        return (services.data ?? []).map((s) => ({ label: s.name, value: s.id }));
      case "industries":
        return (industries.data ?? []).map((i) => ({ label: i.name, value: i.id }));
      default:
        return [];
    }
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        const missing = fields.find((f) => f.required && !String(values[f.name] ?? "").trim());
        if (missing) {
          toast.error(`${missing.label} is required`);
          return;
        }
        save.mutate();
      }}
    >
      {groups.map(([group, groupFields]) => (
        <section key={group} className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {group}
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            {groupFields.map((field) => {
              const value = values[field.name];
              const wide = field.colSpan === 2 || ["textarea", "richtext", "tags", "keyvalue"].includes(field.type);
              return (
                <div key={field.name} className={wide ? "md:col-span-2" : undefined}>
                  <Label htmlFor={field.name} className="mb-2 block">
                    {field.label}
                    {field.required && <span className="text-destructive"> *</span>}
                  </Label>

                  {field.type === "textarea" || field.type === "richtext" ? (
                    <Textarea
                      id={field.name}
                      rows={field.type === "richtext" ? 10 : 4}
                      value={String(value ?? "")}
                      onChange={(e) => set(field.name, e.target.value)}
                    />
                  ) : field.type === "boolean" ? (
                    <div className="flex h-10 items-center">
                      <Switch
                        id={field.name}
                        checked={Boolean(value)}
                        onCheckedChange={(checked) => set(field.name, checked)}
                      />
                    </div>
                  ) : field.type === "select" ? (
                    <Select
                      value={String(value ?? "")}
                      onValueChange={(next) => set(field.name, next === "__none" ? null : next)}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {!field.required && <SelectItem value="__none">None</SelectItem>}
                        {resolveOptions(field).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "tags" ? (
                    <TagListInput
                      value={Array.isArray(value) ? (value as string[]) : []}
                      onChange={(next) => set(field.name, next)}
                    />
                  ) : field.type === "keyvalue" ? (
                    <KeyValueInput
                      value={Array.isArray(value) ? (value as KeyValueItem[]) : []}
                      onChange={(next) => set(field.name, next)}
                    />
                  ) : field.type === "image" || field.type === "file" ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id={field.name}
                          value={String(value ?? "")}
                          placeholder="https://…"
                          onChange={(e) => set(field.name, e.target.value)}
                        />
                        <MediaPickerDialog
                          onSelect={(url) => set(field.name, url)}
                          trigger={
                            <Button type="button" variant="secondary">
                              Browse
                            </Button>
                          }
                        />
                      </div>
                      {field.type === "image" && value ? (
                        <img
                          src={String(value)}
                          alt=""
                          className="h-24 rounded-md border border-border bg-muted object-contain p-1"
                        />
                      ) : null}
                    </div>
                  ) : field.type === "number" ? (
                    <Input
                      id={field.name}
                      type="number"
                      value={Number(value ?? 0)}
                      onChange={(e) => set(field.name, Number(e.target.value))}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type === "date" ? "date" : field.type === "email" ? "email" : "text"}
                      value={String(value ?? "")}
                      onChange={(e) => set(field.name, e.target.value)}
                      onBlur={() => {
                        const slugField = fields.find(
                          (f) => f.type === "slug" && (f.sourceField ?? titleField) === field.name,
                        );
                        if (slugField && !values[slugField.name]) {
                          set(slugField.name, slugify(String(values[field.name] ?? "")));
                        }
                      }}
                    />
                  )}

                  {field.help && (
                    <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex justify-end gap-2 border-t border-border pt-5">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={save.isPending}>
          {save.isPending && <Loader2 className="size-4 animate-spin" />}
          {record?.["id"] ? "Save changes" : "Create"}
        </Button>
      </div>
    </form>
  );
}