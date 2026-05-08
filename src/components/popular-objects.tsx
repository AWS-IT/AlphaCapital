"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { RealEstateObject } from "@/lib/types";
import { ObjectCard } from "@/components/object-card";

export function PopularObjects({ items }: { items: RealEstateObject[] }) {
  if (items.length === 0) return null;

  return (
    <section className="relative">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-eyebrow">Популярные объекты</span>
            <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
              Резиденции, на которые <span className="gold-text">смотрят первыми</span>
            </h2>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/85 transition hover:border-gold/40 hover:text-gold md:self-end"
          >
            Все объекты <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((object, i) => (
            <ObjectCard
              key={object.id}
              object={object}
              priority={i < 3}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
