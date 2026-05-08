"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Layers, Car, Flame } from "lucide-react";

import type { RealEstateObject } from "@/lib/types";
import { cn, formatPrice, truncate } from "@/lib/utils";

type Props = {
  object: RealEstateObject;
  priority?: boolean;
  variant?: "default" | "wide" | "compact";
  index?: number;
};

export function ObjectCard({
  object,
  priority,
  variant = "default",
  index = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-white/15",
        variant === "wide" && "md:flex",
      )}
    >
      <Link href={`/objects/${object.id}`} className="absolute inset-0 z-10" aria-label={object.title} />
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden",
          variant === "wide" && "md:aspect-auto md:w-[55%]",
        )}
      >
        <Image
          src={object.image}
          alt={object.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/30 to-transparent" />
        <div className="absolute inset-x-5 top-5 flex items-start justify-between">
          {object.hot ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-midnight-950 shadow-glow">
              <Flame className="h-3 w-3" /> Хит
            </span>
          ) : (
            <span className="chip">Новостройка</span>
          )}
          {object.deliveryDate && (
            <span className="rounded-full border border-white/15 bg-midnight-950/60 px-3 py-1 text-[11px] tracking-wide text-white/85 backdrop-blur-md">
              {extractYear(object.deliveryDate) || "Скоро"}
            </span>
          )}
        </div>
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
          <div>
            <div className="font-display text-[13px] uppercase tracking-[0.32em] text-gold">
              ЖК
            </div>
            <h3 className="mt-1 font-display text-2xl leading-tight text-white">
              {object.title.replace(/^ЖК\s+/i, "")}
            </h3>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "p-6",
          variant === "wide" && "md:flex md:w-[45%] md:flex-col md:justify-between md:p-8",
        )}
      >
        {object.shortDescription && (
          <p className="text-sm leading-relaxed text-white/65">
            {truncate(object.shortDescription, 130)}
          </p>
        )}
        <ul className="mt-5 grid grid-cols-3 gap-2 text-[11px] uppercase tracking-[0.12em] text-white/55">
          <Spec icon={<Layers className="h-3.5 w-3.5" />} value={shortFloors(object.floors)} />
          <Spec icon={<Building2 className="h-3.5 w-3.5" />} value={shortCommercial(object.commercialFloors)} />
          <Spec icon={<Car className="h-3.5 w-3.5" />} value={shortParking(object.parking)} />
        </ul>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/40">
              Стоимость
            </div>
            <div className="mt-0.5 text-base font-medium text-white">
              {formatPrice(object.price)}
            </div>
          </div>
          <span className="relative z-20 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-all duration-300 group-hover:border-gold/50 group-hover:bg-gold/10 group-hover:text-gold">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Spec({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <li className="flex items-center gap-1.5 text-white/70">
      <span className="text-gold">{icon}</span>
      <span className="truncate">{value || "—"}</span>
    </li>
  );
}

function extractYear(s: string) {
  const m = s.match(/(20\d{2})/);
  return m ? m[1] : null;
}

function shortFloors(s: string) {
  if (!s) return "—";
  const m = s.match(/(\d+(?:[-–]\d+)?)/);
  return m ? `${m[1]} эт.` : s;
}
function shortCommercial(s: string) {
  if (!s) return "—";
  const m = s.match(/(\d+)/);
  return m ? `Комм. ${m[1]} эт.` : "Коммерция";
}
function shortParking(s: string) {
  if (!s) return "—";
  if (/подзем/i.test(s)) return "Подземный паркинг";
  if (/назем/i.test(s)) return "Наземный паркинг";
  if (/многоуров/i.test(s)) return "Многоуровневый";
  return "Паркинг";
}
