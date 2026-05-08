"use client";

import { motion } from "framer-motion";
import {
  Award,
  HandCoins,
  KeySquare,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const ITEMS = [
  {
    icon: Award,
    title: "Закрытый пул объектов",
    text: "Доступ к лотам, которые не публикуются в открытых каналах.",
  },
  {
    icon: HandCoins,
    title: "Прямые цены застройщика",
    text: "Без агентских наценок и скрытых комиссий — только условия первой линии.",
  },
  {
    icon: ShieldCheck,
    title: "Юридическая чистота",
    text: "Полная проверка документов и сопровождение сделки нашими юристами.",
  },
  {
    icon: ScrollText,
    title: "Рассрочка и ипотека",
    text: "Подбираем оптимальные программы вместе с банками-партнёрами.",
  },
  {
    icon: KeySquare,
    title: "Приватные просмотры",
    text: "Организуем визит на объект в удобное для вас время — без очередей.",
  },
  {
    icon: Sparkles,
    title: "Эстетика и сервис",
    text: "Премиальный сервис на каждом этапе — от первой встречи до новоселья.",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="relative">
      <div className="container-x">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-eyebrow">Преимущества</span>
            <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
              Сервис, выверенный <span className="gold-text">до детали</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/65">
            Сотни сделок ежегодно, выверенные процессы и личное внимание к каждому
            клиенту — то, что отличает Alpha Capital.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
              className="group relative bg-midnight-950/95 p-8 transition-colors hover:bg-midnight-900/90"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                  <item.icon className="h-5 w-5" />
                </span>
                <div className="font-display text-2xl text-white">
                  {item.title}
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/65">
                {item.text}
              </p>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
