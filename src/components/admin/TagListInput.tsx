import { X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TagListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const item = draft.trim();
    if (!item) return;
    onChange([...value, item]);
    setDraft("");
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder ?? "Add an item and press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={add}>
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <li key={`${item}-${index}`}>
              <Badge variant="secondary" className="gap-1.5 py-1">
                {item}
                <button
                  type="button"
                  aria-label={`Remove ${item}`}
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export interface KeyValueItem {
  label: string;
  value: string;
}

export function KeyValueInput({
  value,
  onChange,
}: {
  value: KeyValueItem[];
  onChange: (next: KeyValueItem[]) => void;
}) {
  return (
    <div className="space-y-2">
      {value.map((row, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={row.label}
            placeholder="Label"
            onChange={(e) => {
              const next = [...value];
              next[index] = { ...row, label: e.target.value };
              onChange(next);
            }}
          />
          <Input
            value={row.value}
            placeholder="Value"
            onChange={(e) => {
              const next = [...value];
              next[index] = { ...row, value: e.target.value };
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove specification"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange([...value, { label: "", value: "" }])}
      >
        Add specification
      </Button>
    </div>
  );
}