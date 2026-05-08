import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Car,
  Compass,
  Layers,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { getObjectById, getObjects } from "@/lib/data";
import { ObjectActions } from "@/components/object-actions";
import { ObjectMap } from "@/components/object-map";
import { ObjectCard } from "@/components/object-card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

export async function generateStaticParams() {
  const list = await getObjects();
  return list.map((o) => ({ id: String(o.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const obj = await getObjectById(Number(id));
  if (!obj) return { title: "Объект не найден" };
  return {
    title: obj.title,
    description: obj.shortDescription || obj.description.slice(0, 160),
    openGraph: { images: [obj.image] },
  };
}

export default async function ObjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const object = await getObjectById(numericId);
  if (!object) notFound();

  const all = await getObjects();
  const similar = all
    .filter((o) => o.id !== object.id && o.title !== object.title)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <article className="relative pt-[80px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[80vh] overflow-hidden md:block"
      >
        <Image
          src={object.image}
          alt=""
          fill
          priority
          className="scale-110 object-cover opacity-25 blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/70 via-midnight-950/85 to-midnight-950" />
      </div>

      <div className="container-x">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Все объекты
        </Link>

        <div className="mt-2 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="label-eyebrow">Жилой комплекс</span>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-white md:text-6xl">
              {object.title.replace(/^ЖК\s+/i, "")}
            </h1>
            {object.shortDescription && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
                {object.shortDescription}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-[12px] uppercase tracking-[0.18em] text-white/55">
              {object.deliveryDate && (
                <span className="chip">
                  <Calendar className="h-3.5 w-3.5 text-gold" />
                  {object.deliveryDate}
                </span>
              )}
              {object.hot && (
                <span className="chip border-gold/40 text-gold">Хит продаж</span>
              )}
              {object.latitude && (
                <span className="chip">
                  <MapPin className="h-3.5 w-3.5 text-gold" /> Грозный
                </span>
              )}
            </div>

            <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={object.image}
                  alt={object.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-midnight-950/80 to-transparent" />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="glass-panel sticky top-[100px] space-y-7 p-7">
              <div>
                <div className="text-[12px] uppercase tracking-[0.22em] text-white/45">
                  Стоимость
                </div>
                <div className="mt-2 font-display text-3xl text-white">
                  {formatPrice(object.price)}
                </div>
              </div>
              <div className="hairline" />
              <ul className="grid gap-4 sm:grid-cols-2">
                <SpecCard
                  icon={<Layers className="h-4 w-4" />}
                  label="Этажность"
                  value={object.floors || "—"}
                />
                <SpecCard
                  icon={<Building2 className="h-4 w-4" />}
                  label="Коммерция"
                  value={object.commercialFloors || "—"}
                />
                <SpecCard
                  icon={<Car className="h-4 w-4" />}
                  label="Паркинг"
                  value={object.parking || "—"}
                />
                <SpecCard
                  icon={<Calendar className="h-4 w-4" />}
                  label="Срок сдачи"
                  value={object.deliveryDate || "—"}
                />
              </ul>
              <ObjectActions object={object} />
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-[12px] text-white/55">
                <ShieldCheck className="h-4 w-4 text-gold" />
                Сопровождение и проверка документов — за наш счёт.
              </div>
            </div>
          </aside>
        </div>

        {object.description && (
          <section className="mx-auto mt-20 max-w-3xl">
            <span className="label-eyebrow">О комплексе</span>
            <div className="mt-5 space-y-5 text-[15px] leading-[1.85] text-white/75">
              {splitParagraphs(object.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {object.latitude && object.longitude && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="label-eyebrow">Расположение</span>
                <h2 className="mt-3 font-display text-3xl text-white">
                  На карте Грозного
                </h2>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/map">
                  <Compass className="h-4 w-4" /> Все на карте
                </Link>
              </Button>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/10">
              <ObjectMap
                points={[
                  {
                    id: object.id,
                    title: object.title,
                    lat: object.latitude,
                    lng: object.longitude,
                    href: `/objects/${object.id}`,
                    price: object.price,
                    image: object.image,
                    deliveryDate: object.deliveryDate,
                  },
                ]}
                zoom={16}
                height={420}
              />
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mt-20">
            <div className="mb-8p flex items-end justify-between">
              <div>
                <span className="label-eyebrow">Похожие объекты</span>
                <h2 className="mt-3 font-display text-3xl text-white">
                  Возможно, вам понравится
                </h2>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/catalog">Весь каталог</Link>
              </Button>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((o, i) => (
                <ObjectCard key={o.id} object={o} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function SpecCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
        <span className="text-gold">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-sm leading-snug text-white">{value}</div>
    </li>
  );
}

function splitParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
