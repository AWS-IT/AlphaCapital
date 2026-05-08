"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead-modal";

export function CallToAction() {
  const { open } = useLeadModal();
  return (
    <section className="relative">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[36px] border border-white/10 px-7 py-14 md:px-16 md:py-20"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(80% 120% at 0% 0%, rgba(201,168,106,0.18) 0%, transparent 60%), radial-gradient(80% 120% at 100% 100%, rgba(201,168,106,0.12) 0%, transparent 60%), linear-gradient(135deg, rgba(17,34,61,0.9), rgba(10,22,42,0.95))",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-noise opacity-40"
          />
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <span className="label-eyebrow">Персональная консультация</span>
              <h2 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">
                Подберём резиденцию под ваши <span className="gold-text">цели и стиль</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
                Бесплатный подбор за 24 часа. Наши эксперты учтут планировку,
                локацию, инвестиционный горизонт и сопроводят до подписания.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="flex flex-col gap-4 md:items-end">
                <Button size="lg" onClick={() => open({ source: "cta" })}>
                  Оставить заявку
                </Button>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="btn-ghost"
                >
                  <Phone className="h-4 w-4 text-gold" /> {siteConfig.phone}
                </a>
                <span className="text-[12px] uppercase tracking-[0.18em] text-white/45">
                  {siteConfig.workingHours}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
