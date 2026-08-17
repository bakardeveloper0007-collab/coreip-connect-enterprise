import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import type { FacetOption } from "./catalog-utils";

export interface FilterState {
  brands: string[];
  availability: string[];
  specs: Record<string, string[]>;
  minPrice: string;
  maxPrice: string;
}

export const EMPTY_FILTERS: FilterState = {
  brands: [],
  availability: [],
  specs: {},
  minPrice: "",
  maxPrice: "",
};

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function activeFilterCount(state: FilterState): number {
  return (
    state.brands.length +
    state.availability.length +
    Object.values(state.specs).reduce((sum, values) => sum + values.length, 0) +
    (state.minPrice ? 1 : 0) +
    (state.maxPrice ? 1 : 0)
  );
}

interface PanelProps {
  brands: string[];
  availability: string[];
  facets: FacetOption[];
  state: FilterState;
  onChange: (next: FilterState) => void;
}

function Group({
  title,
  values,
  selected,
  onToggle,
}: {
  title: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (values.length === 0) return null;
  return (
    <div className="border-b border-border pb-4">
      <p className="font-display text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-2.5 max-h-48 space-y-2 overflow-y-auto pr-1">
        {values.map((value) => {
          const id = `${title}-${value}`.replace(/\s+/g, "-").toLowerCase();
          return (
            <div key={value} className="flex items-center gap-2">
              <Checkbox
                id={id}
                checked={selected.includes(value)}
                onCheckedChange={() => onToggle(value)}
              />
              <Label htmlFor={id} className="cursor-pointer text-sm text-muted-foreground">
                {value}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FilterPanel({ brands, availability, facets, state, onChange }: PanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-bold text-foreground">Filters</p>
        {activeFilterCount(state) > 0 && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            <X className="size-3" /> Clear all
          </button>
        )}
      </div>

      <Group
        title="Brand"
        values={brands}
        selected={state.brands}
        onToggle={(value) => onChange({ ...state, brands: toggle(state.brands, value) })}
      />

      <div className="border-b border-border pb-4">
        <p className="font-display text-sm font-semibold text-foreground">Price range (₹)</p>
        <div className="mt-2.5 flex items-center gap-2">
          <Input
            inputMode="numeric"
            placeholder="Min"
            value={state.minPrice}
            onChange={(e) => onChange({ ...state, minPrice: e.target.value.replace(/\D/g, "") })}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            inputMode="numeric"
            placeholder="Max"
            value={state.maxPrice}
            onChange={(e) => onChange({ ...state, maxPrice: e.target.value.replace(/\D/g, "") })}
          />
        </div>
      </div>

      <Group
        title="Availability"
        values={availability}
        selected={state.availability}
        onToggle={(value) =>
          onChange({ ...state, availability: toggle(state.availability, value) })
        }
      />

      {facets.map((facet) => (
        <Group
          key={facet.label}
          title={facet.label}
          values={facet.values}
          selected={state.specs[facet.label] ?? []}
          onToggle={(value) =>
            onChange({
              ...state,
              specs: {
                ...state.specs,
                [facet.label]: toggle(state.specs[facet.label] ?? [], value),
              },
            })
          }
        />
      ))}
    </div>
  );
}

/** Mobile filter drawer trigger. */
export function FilterDrawer(props: PanelProps) {
  const count = activeFilterCount(props.state);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal className="size-4" />
          Filters{count > 0 ? ` (${count})` : ""}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Refine products</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <FilterPanel {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}