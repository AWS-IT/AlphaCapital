"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";

import type { RealEstateObject } from "@/lib/types";
import { ObjectCard } from "@/components/object-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, extractDeliveryYear, extractFloors, extractPriceNumber } from "@/lib/utils";

type SortKey =
  | "default"
  | "priceAsc"
  | "priceDesc"
  | "delivery"
  | "floorsDesc"
  | "hot";

type Filters = {
  query: string;
  sort: SortKey;
  hotOnly: boolean;
  withMap: boolean;
  parking: "any" | "underground" | "ground" | "multi";
  yearMin: number | null;
  yearMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
};

const DEFAULTS: Filters = {
  query: "",
  sort: "default",
  hotOnly: false,
  withMap: false,
  parking: "any",
  yearMin: null,
  yearMax: null,
  priceMin: null,
  priceMax: null,
};

export function Catalog({ items }: { items: RealEstateObject[] }) {
  const [filters, setFilters] = React.useState<Filters>(DEFAULTS);
  const [showFilters, setShowFilters] = React.useState(false);
  const [visible, setVisible] = React.useState(12);

  const indexed = React.useMemo(
    () =>
      items.map((o) => ({
        obj: o,
        priceNum: extractPriceNumber(o.price),
        floorsNum: extractFloors(o.floors),
        year: extractDeliveryYear(o.deliveryDate),
        haystack:
          (o.title + " " + o.shortDescription + " " + o.description).toLowerCase(),
      })),
    [items],
  );

  const filtered = React.useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const result = indexed.filter(({ obj, priceNum, year }) => {
      if (q && !obj.title.toLowerCase().includes(q) && !obj.shortDescription.toLowerCase().includes(q) && !obj.description.toLowerCase().includes(q)) {
        return false;
      }
      if (filters.hotOnly && !obj.hot) return false;
      if (filters.withMap && (obj.latitude == null || obj.longitude == null))
        return false;
      if (filters.parking !== "any") {
        const p = (obj.parking || "").toLowerCase();
        if (filters.parking === "underground" && !/подзем/.test(p)) return false;
        if (filters.parking === "ground" && !/назем/.test(p)) return false;
        if (filters.parking === "multi" && !/многоуров/.test(p)) return false;
      }
      if (filters.yearMin && (year ?? 0) < filters.yearMin) return false;
      if (filters.yearMax && (year ?? 9999) > filters.yearMax) return false;
      if (filters.priceMin && (priceNum ?? 0) < filters.priceMin) return false;
      if (filters.priceMax && (priceNum ?? 1e15) > filters.priceMax) return false;
      return true;
    });

    const sorted = [...result];
    switch (filters.sort) {
      case "priceAsc":
        sorted.sort((a, b) => (a.priceNum ?? 1e15) - (b.priceNum ?? 1e15));
        break;
      case "priceDesc":
        sorted.sort((a, b) => (b.priceNum ?? 0) - (a.priceNum ?? 0));
        break;
      case "delivery":
        sorted.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));
        break;
      case "floorsDesc":
        sorted.sort((a, b) => (b.floorsNum ?? 0) - (a.floorsNum ?? 0));
        break;
      case "hot":
        sorted.sort((a, b) => Number(b.obj.hot) - Number(a.obj.hot));
        break;
      default:
        sorted.sort(
          (a, b) =>
            Number(b.obj.hot) - Number(a.obj.hot) ||
            (a.year ?? 9999) - (b.year ?? 9999),
        );
    }
    return sorted.map((x) => x.obj);
  }, [indexed, filters]);

  const yearOptions = React.useMemo(() => {
    const ys = new Set<number>();
    indexed.forEach(({ year }) => year && ys.add(year));
    return Array.from(ys).sort();
  }, [indexed]);

  const reset = () => setFilters(DEFAULTS);
  const activeFilterCount =
    Number(filters.hotOnly) +
    Number(filters.withMap) +
    Number(filters.parking !== "any") +
    Number(filters.yearMin !== null) +
    Number(filters.yearMax !== null) +
    Number(filters.priceMin !== null) +
    Number(filters.priceMax !== null);

  return (
    <div className="space-y-10">
      <div className="container-x">
        <div className="glass-panel grid gap-4 p-5 md:grid-cols-[1.5fr,1fr,auto] md:items-center md:gap-3 md:p-3 md:pl-5">
          <label className="flex items-center gap-3">
            <Search className="h-4 w-4 text-white/40" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) =>
                setFilters((f) => ({ ...f, query: e.target.value }))
              }
              placeholder="Найти ЖК или район…"
              className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            {filters.query && (
              <button
                aria-label="Очистить"
                onClick={() => setFilters((f) => ({ ...f, query: "" }))}
                className="grid h-7 w-7 place-items-center rounded-full text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters((f) => ({ ...f, sort: e.target.value as SortKey }))
            }
            className="h-12 w-full rounded-xl border border-white/10 bg-midnight-900/70 px-4 text-sm text-white outline-none transition focus:border-gold/50"
          >
            <option value="default">По актуальности</option>
            <option value="hot">Сначала горячие</option>
            <option value="priceAsc">Цена: дешевле</option>
            <option value="priceDesc">Цена: дороже</option>
            <option value="delivery">Скорая сдача</option>
            <option value="floorsDesc">Больше этажей</option>
          </select>
          <Button
            variant="ghost"
            onClick={() => setShowFilters((v) => !v)}
            className="md:h-12"
          >
            <Filter className="h-4 w-4" />
            Фильтры
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-gold/95 px-2 py-0.5 text-[11px] font-semibold text-midnight-950">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 grid gap-4 rounded-3xl border border-white/10 bg-midnight-900/60 p-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <FilterToggle
              label="Только горячие"
              checked={filters.hotOnly}
              onChange={(v) => setFilters((f) => ({ ...f, hotOnly: v }))}
            />
            <FilterToggle
              label="Есть на карте"
              checked={filters.withMap}
              onChange={(v) => setFilters((f) => ({ ...f, withMap: v }))}
            />
            <FilterSelect
              label="Паркинг"
              value={filters.parking}
              onChange={(v) =>
                setFilters((f) => ({ ...f, parking: v as Filters["parking"] }))
              }
              options={[
                { value: "any", label: "Любой" },
                { value: "underground", label: "Подземный" },
                { value: "ground", label: "Наземный" },
                { value: "multi", label: "Многоуровневый" },
              ]}
            />
            <FilterSelect
              label="Сдача от"
              value={filters.yearMin?.toString() ?? ""}
              onChange={(v) =>
                setFilters((f) => ({ ...f, yearMin: v ? Number(v) : null }))
              }
              options={[
                { value: "", label: "Любой год" },
                ...yearOptions.map((y) => ({ value: String(y), label: String(y) })),
              ]}
            />
            <FilterSelect
              label="Сдача до"
              value={filters.yearMax?.toString() ?? ""}
              onChange={(v) =>
                setFilters((f) => ({ ...f, yearMax: v ? Number(v) : null }))
              }
              options={[
                { value: "", label: "Любой год" },
                ...yearOptions.map((y) => ({ value: String(y), label: String(y) })),
              ]}
            />
            <NumberField
              label="Цена от, ₽/м²"
              value={filters.priceMin}
              onChange={(v) => setFilters((f) => ({ ...f, priceMin: v }))}
            />
            <NumberField
              label="Цена до, ₽/м²"
              value={filters.priceMax}
              onChange={(v) => setFilters((f) => ({ ...f, priceMax: v }))}
            />
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={reset} className="w-full">
                Сбросить
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="container-x">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/55">
            Найдено: <span className="text-white">{filtered.length}</span> из {items.length}
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visible).map((object, i) => (
                <ObjectCard key={object.id} object={object} index={i} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setVisible((v) => v + 12)}
                >
                  Показать ещё
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-sm transition",
        checked
          ? "border-gold/40 bg-gold/10 text-white"
          : "border-white/10 bg-white/[0.02] text-white/75 hover:border-white/20",
      )}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#c9a86a]"
      />
    </label>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-midnight-900/70 px-4 text-sm text-white outline-none transition focus:border-gold/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      <Input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        placeholder="—"
      />
    </label>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-5 rounded-3xl border border-white/10 bg-white/[0.02] px-8 py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
        <Search className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-2xl text-white">Ничего не найдено</h3>
        <p className="max-w-md text-sm text-white/65">
          Попробуйте смягчить условия или сбросить фильтры — мы подберём подходящий объект персонально.
        </p>
      </div>
      <Button variant="ghost" onClick={onReset}>
        Сбросить фильтры
      </Button>
    </div>
  );
}
