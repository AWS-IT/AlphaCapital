"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Flame } from "lucide-react";

import type { RealEstateObject } from "@/lib/types";
import { cn, formatPrice, truncate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead-modal";

export function HotSlider({ items }: { items: RealEstateObject[] }) {
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [Autoplay({ delay: 6000, stopOnInteraction: true })],
  );
  const [selected, setSelected] = React.useState(0);
  const [scrollSnaps, setSnaps] = React.useState<number[]>([]);
  const { open } = useLeadModal();

  React.useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    embla.on("select", () => setSelected(embla.selectedScrollSnap()));
  }, [embla]);

  if (items.length === 0) return null;

  return (
    <section className="relative">
      <div className="container-x mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="label-eyebrow inline-flex items-center gap-2">
            <Flame className="h-3.5 w-3.5" /> Горячие предложения
          </span>
          <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
            Лоты с максимальным <span className="gold-text">потенциалом</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 self-end">
          <button
            onClick={() => embla?.scrollPrev()}
            aria-label="Назад"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition hover:border-gold/40 hover:text-gold"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => embla?.scrollNext()}
            aria-label="Вперёд"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition hover:border-gold/40 hover:text-gold"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={emblaRef}
        className="overflow-hidden"
        aria-label="Горячие предложения"
      >
        <div className="container-x flex gap-6">
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="relative flex-[0_0_92%] overflow-hidden rounded-[28px] border border-white/10 bg-midnight-900/60 sm:flex-[0_0_70%] md:flex-[0_0_55%] lg:flex-[0_0_46%] xl:flex-[0_0_42%]"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={i === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/40 to-transparent" />
                <div className="absolute inset-x-7 top-7 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gold/95 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-midnight-950 shadow-glow">
                    <Flame className="h-3 w-3" /> Hot
                  </span>
                  <span className="rounded-full border border-white/15 bg-midnight-950/60 px-3 py-1.5 text-[12px] tracking-wide text-white/85 backdrop-blur-md">
                    {item.deliveryDate || "Сдача скоро"}
                  </span>
                </div>
                <div className="absolute inset-x-7 bottom-7 flex flex-col gap-1.5">
                  <span className="font-display text-[12px] uppercase tracking-[0.34em] text-gold">
                    Жилой комплекс
                  </span>
                  <h3 className="font-display text-[34px] leading-tight text-white sm:text-[44px]">
                    {item.title.replace(/^ЖК\s+/i, "")}
                  </h3>
                </div>
              </div>
              <div className="grid gap-6 p-7 md:grid-cols-2 md:items-end">
                <p className="text-sm leading-relaxed text-white/70">
                  {truncate(item.shortDescription || item.description, 180)}
                </p>
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/40 md:text-right">
                      Цена
                    </div>
                    <div className="mt-1 text-base font-medium text-white">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/objects/${item.id}`}>
                        Подробнее <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        open({
                          source: "hot-slider",
                          objectId: item.id,
                          objectTitle: item.title,
                        })
                      }
                    >
                      Записаться
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="container-x mt-8 flex justify-center gap-2">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            aria-label={`Слайд ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === selected ? "w-8 bg-gold" : "w-3 bg-white/15 hover:bg-white/30",
            )}
          />
        ))}
      </div>
    </section>
  );
}
