"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";

import type { RealEstateObject } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead-modal";

export function Hero({ feature }: { feature: RealEstateObject | null }) {
  const { open } = useLeadModal();

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(201,168,106,0.12)_0%,transparent_60%)]"
      />
      <div className="container-x grid min-h-[10dvh] items-end gap-10 pb-16 pt-[140px] md:grid-cols-12 md:pb-24 md:pt-[160px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:col-span-6 lg:col-span-7"
        >
          <span className="label-eyebrow inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Закрытый клуб премиальной недвижимости
          </span>
          <h1 className="mt-6 font-display text-balance text-[44px] leading-[1.04] text-white sm:text-[56px] md:text-[68px] lg:text-[84px]">
            Резиденции <span className="gold-text">высшего класса</span>
            <span className="block">в сердце Грозного</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Подбираем апартаменты от первой линии застройщиков, открываем доступ
            к закрытым лотам и сопровождаем сделку до выдачи ключей.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => open({ source: "hero" })}>
              Подобрать недвижимость
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/catalog">
                Каталог объектов <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { value: "100+", label: "объектов в работе" },
              { value: "12", label: "лет на рынке" },
              { value: "А+", label: "сопровождение сделок" },
            ].map((s) => (
              <div key={s.label} className="border-l border-white/10 pl-4">
                <div className="font-display text-3xl text-white">{s.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {feature && (
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="md:col-span-6 lg:col-span-5"
          >
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-2 -z-10 rounded-[36px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(201,168,106,0.25),transparent_70%)] blur-2xl"
              />
              <Link
                href={`/objects/${feature.id}`}
                className="group relative block overflow-hidden rounded-[32px] border border-white/10 bg-midnight-900/60"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[3/4]">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/40 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <div className="font-display text-[12px] uppercase tracking-[0.36em] text-gold">
                    Объект недели
                  </div>
                  <div className="mt-2 font-display text-3xl leading-tight text-white md:text-4xl">
                    {feature.title.replace(/^ЖК\s+/i, "")}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[12px] uppercase tracking-[0.18em] text-white/55">
                    <span>{feature.deliveryDate || "Скоро в продаже"}</span>
                    <span className="inline-flex items-center gap-2 text-gold">
                      Подробнее <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </motion.aside>
        )}
      </div>
      <div className="container-x flex justify-center pb-10">
        <a
          href="#advantages"
          aria-label="Прокрутить"
          className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-white/45 transition hover:text-gold"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10">
            <ArrowDown className="h-4 w-4" />
          </span>
          Откройте подборку
        </a>
      </div>
    </section>
  );
}
