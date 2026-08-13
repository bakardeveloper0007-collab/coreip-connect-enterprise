export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "select"
  | "slug"
  | "image"
  | "file"
  | "tags"
  | "keyvalue"
  | "email"
  | "url"
  | "date";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  /** Options resolved at runtime, e.g. categories or products. */
  optionsSource?: "categories" | "products" | "services" | "industries";
  sourceField?: string;
  group?: string;
  colSpan?: 1 | 2;
}

export const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export function emptyValueFor(field: FieldDef): unknown {
  switch (field.type) {
    case "boolean":
      return false;
    case "number":
      return 0;
    case "tags":
      return [];
    case "keyvalue":
      return [];
    default:
      return "";
  }
}

export function buildDefaults(fields: FieldDef[], record?: Record<string, unknown> | null) {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    const current = record?.[field.name];
    values[field.name] = current === undefined || current === null ? emptyValueFor(field) : current;
  }
  return values;
}