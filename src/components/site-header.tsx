"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead-modal";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/map", label: "Карта" },
  { href: "/about", label: "О компании" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { open } = useLeadModal();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-midnight-950/85 backdrop-blur-xl shadow-[0_8px_30px_-10px_rgba(0,0,0,0.6)]"
            : "bg-transparent",
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="container-x flex h-[78px] items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3 text-white"
            aria-label={siteConfig.name}
          >
            <Logo className="h-9 w-9 transition-transform group-hover:scale-105" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-[22px] tracking-wide">
                Alpha <span className="gold-text">Capital</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
                {siteConfig.city} · недвижимость
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => {
              const active =
                n.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    active
                      ? "text-white"
                      : "text-white/65 hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.06]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white md:inline-flex"
            >
              <Phone className="h-4 w-4 text-gold" />
              {siteConfig.phone}
            </a>
            <Button
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => open({ source: "header" })}
            >
              Оставить заявку
            </Button>
            <button
              aria-label="Меню"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-30 bg-midnight-950/95 backdrop-blur-xl lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              onClick={(e) => e.stopPropagation()}
              className="container-x flex flex-col gap-1 pt-[100px]"
            >
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-lg text-white"
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <Button onClick={() => open({ source: "mobile" })} size="lg">
                  Оставить заявку
                </Button>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="btn-ghost"
                >
                  <Phone className="h-4 w-4" /> {siteConfig.phone}
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
