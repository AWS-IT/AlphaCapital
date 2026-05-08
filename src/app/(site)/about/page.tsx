import type { Metadata } from "next";
import Image from "next/image";
import { Award, HeartHandshake, Building, ChartBar } from "lucide-react";

import { CallToAction } from "@/components/cta";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Alpha Capital — закрытый клуб премиальной недвижимости Грозного. Эксперты с 12-летним опытом сопровождения сделок.",
};

const STATS = [
  { value: "12 лет", label: "На рынке Грозного" },
  { value: "100+", label: "Объектов в работе" },
  { value: "650+", label: "Закрытых сделок" },
  { value: "98%", label: "Клиентов рекомендуют нас" },
];

const PRINCIPLES = [
  {
    icon: Award,
    title: "Премиальный сервис",
    text: "Подбираем варианты как для себя — без шаблонов и формальностей.",
  },
  {
    icon: HeartHandshake,
    title: "Доверие клиента",
    text: "Прозрачные условия, фиксированные комиссии, открытый диалог.",
  },
  {
    icon: Building,
    title: "Только проверенные ЖК",
    text: "Работаем только с застройщиками, чья репутация подтверждена.",
  },
  {
    icon: ChartBar,
    title: "Экспертиза и аналитика",
    text: "Опираемся на цифры: ROI, ликвидность и сравнительный анализ.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-32 pb-32 pt-[140px]">
      <section className="container-x grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="label-eyebrow">О компании</span>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-white md:text-6xl">
            Создаём культуру <span className="gold-text">премиальной недвижимости</span> в Грозном
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Alpha Capital — это команда экспертов, для которых каждая сделка
            начинается с понимания вашего стиля жизни. Мы открываем доступ к
            объектам, которых нет в публичных каналах, и сопровождаем
            покупателя от первого визита до выдачи ключей.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10">
            <Image
              src="/objects/Empire.jpg"
              alt="Alpha Capital"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent" />
            <div className="absolute inset-x-7 bottom-7 text-white">
              <div className="text-[12px] uppercase tracking-[0.32em] text-gold">
                Грозный · 2026
              </div>
              <div className="mt-1 font-display text-3xl">
                Высоты, которым доверяют
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-midnight-950/95 p-7">
              <div className="font-display text-4xl text-white">{s.value}</div>
              <div className="mt-2 text-[12px] uppercase tracking-[0.22em] text-white/45">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x">
        <div className="max-w-2xl">
          <span className="label-eyebrow">Наш подход</span>
          <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
            Принципы, на которых строится <span className="gold-text">партнёрство</span>
          </h2>
        </div>
        <div className="mt-10 grid gap-7 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-7"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl text-white">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <CallToAction />
    </div>
  );
}
