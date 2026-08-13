import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TagListInput } from "@/components/admin/TagListInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SETTINGS_FALLBACK } from "@/hooks/useSiteSettings";
import type { SettingsKey, WebsiteSettings } from "@/models";
import { getWebsiteSettings, updateSetting } from "@/services/api";
import { humanize } from "@/utils/format";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const GROUPS: { key: SettingsKey; label: string; description: string }[] = [
  { key: "contact_info", label: "Contact", description: "Phone numbers, emails and address used site-wide." },
  { key: "homepage", label: "Homepage", description: "Hero content and which homepage sections appear." },
  { key: "seo_defaults", label: "SEO", description: "Default titles, description and social image." },
  { key: "cta_labels", label: "CTA labels", description: "Button labels reused across the website." },
  { key: "navigation", label: "Navigation", description: "Which menus appear in the main navigation." },
  { key: "chatbot", label: "Assistant", description: "CoreIP assistant behaviour and greeting." },
  { key: "social_links", label: "Social", description: "Social profile links shown in the footer." },
  { key: "footer", label: "Footer", description: "Footer tagline and policy links." },
];

const LONG_TEXT_KEYS = new Set([
  "address",
  "hero_description",
  "default_description",
  "tagline",
  "greeting",
  "fallback",
]);

function GroupEditor({ groupKey }: { groupKey: SettingsKey }) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getWebsiteSettings(),
  });

  const fallback = SETTINGS_FALLBACK[groupKey] as Record<string, unknown>;
  const [values, setValues] = useState<Record<string, unknown>>(fallback);

  useEffect(() => {
    if (data) {
      setValues({ ...fallback, ...((data[groupKey] as Record<string, unknown>) ?? {}) });
    }
  }, [data, groupKey]);

  const save = useMutation({
    mutationFn: () =>
      updateSetting(groupKey, values as WebsiteSettings[typeof groupKey]),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {Object.keys(fallback).map((field) => {
          const value = values[field];
          const fallbackValue = fallback[field];
          const isBoolean = typeof fallbackValue === "boolean";
          const isNumber = typeof fallbackValue === "number";
          const isArray = Array.isArray(fallbackValue);
          const isLong = LONG_TEXT_KEYS.has(field);

          return (
            <div key={field} className={isArray || isLong ? "md:col-span-2" : undefined}>
              <Label htmlFor={`${groupKey}-${field}`} className="mb-2 block">
                {humanize(field)}
              </Label>
              {isBoolean ? (
                <div className="flex h-10 items-center">
                  <Switch
                    id={`${groupKey}-${field}`}
                    checked={Boolean(value)}
                    onCheckedChange={(checked) =>
                      setValues((prev) => ({ ...prev, [field]: checked }))
                    }
                  />
                </div>
              ) : isArray ? (
                <TagListInput
                  value={Array.isArray(value) ? (value as string[]) : []}
                  onChange={(next) => setValues((prev) => ({ ...prev, [field]: next }))}
                />
              ) : isLong ? (
                <Textarea
                  id={`${groupKey}-${field}`}
                  rows={3}
                  value={String(value ?? "")}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))}
                />
              ) : (
                <Input
                  id={`${groupKey}-${field}`}
                  type={isNumber ? "number" : "text"}
                  value={isNumber ? Number(value ?? 0) : String(value ?? "")}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [field]: isNumber ? Number(e.target.value) : e.target.value,
                    }))
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending && <Loader2 className="size-4 animate-spin" />}
          Save {humanize(groupKey)}
        </Button>
      </div>
    </form>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Website settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact details, homepage content, SEO defaults, navigation and assistant behaviour.
        </p>
      </div>

      <Tabs defaultValue="contact_info">
        <TabsList className="flex h-auto flex-wrap justify-start">
          {GROUPS.map((group) => (
            <TabsTrigger key={group.key} value={group.key}>
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {GROUPS.map((group) => (
          <TabsContent key={group.key} value={group.key} className="mt-6 space-y-5">
            <p className="text-sm text-muted-foreground">{group.description}</p>
            <GroupEditor groupKey={group.key} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}