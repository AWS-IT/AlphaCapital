"use client";

import Link from "next/link";
import {
  Phone,
  MapPin,
  Send,
  Instagram,
  MessageCircle,
} from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead-modal";

export function SiteFooter() {
  const { open } = useLeadModal();
  return (
    <footer className="relative mt-2 border-t border-white/10 bg-midnight-950/80 pt-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-midnight-950/80"
      />
      <div className="container-x grid gap-12 pb-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <div className="leading-tight">
              <div className="font-display text-2xl">
                Lam <span className="gold-text">Capital</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                Premium real estate · {siteConfig.city}
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
            Подбираем апартаменты и резиденции от ведущих застройщиков Грозного.
            Сопровождаем сделку под ключ — от приватного просмотра до выдачи
            ключей.
          </p>
          <Button onClick={() => open({ source: "footer" })} className="mt-7">
            Оставить заявку
          </Button>
        </div>

        <div className="md:col-span-3">
          <div className="label-eyebrow">Меню</div>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {[
              { href: "/", label: "Главная" },
              { href: "/catalog", label: "Каталог" },
              { href: "/map", label: "Карта объектов" },
              { href: "/about", label: "О компании" },
            ].map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="transition-colors hover:text-gold"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="label-eyebrow">Контакты</div>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5">
                <Phone className="h-4 w-4 text-gold" />
              </span>
              <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5">
                <MapPin className="h-4 w-4 text-gold" />
              </span>
              {siteConfig.address}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5">
                <Send className="h-4 w-4 text-gold" />
              </span>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            {[
              { href: siteConfig.socials.instagram, icon: Instagram, label: "Instagram" },
              { href: siteConfig.socials.telegram, icon: Send, label: "Telegram" },
              { href: siteConfig.socials.whatsapp, icon: MessageCircle, label: "WhatsApp" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:-translate-y-px hover:border-gold/40 hover:text-gold"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container-x flex flex-col items-start justify-between gap-4 border-t border-white/10 py-6 text-[12px] text-white/40 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {siteConfig.legalName}. Все права защищены.
        </span>
        <span>{siteConfig.workingHours}</span>
      </div>
    </footer>
  );
}
