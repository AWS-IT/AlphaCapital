import type { Metadata } from "next";
import { ObjectMap, type MapPoint } from "@/components/object-map";
import { getMappedObjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Карта объектов",
  description: "Все жилые комплексы Alpha Capital на карте Грозного.",
};

export const revalidate = 60;

export default async function MapPage() {
  const objects = await getMappedObjects();
  const points: MapPoint[] = objects.map((o) => ({
    id: o.id,
    title: o.title,
    lat: o.latitude!,
    lng: o.longitude!,
    href: `/objects/${o.id}`,
    price: o.price,
    image: o.image,
    deliveryDate: o.deliveryDate,
  }));

  return (
    <div className="pt-[140px]">
      <header className="container-x mb-10 max-w-3xl">
        <span className="label-eyebrow">Карта</span>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">
          Объекты на карте <span className="gold-text">Грозного</span>
        </h1>
        <p className="mt-5 text-base text-white/65">
          Кликните по метке, чтобы посмотреть карточку комплекса. Карта
          оформлена в фирменном тёмно-синем стиле.
        </p>
      </header>
      <div className="container-x">
        <div className="overflow-hidden rounded-[28px] border border-white/10">
          <ObjectMap points={points} height={660} />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-[12px] uppercase tracking-[0.18em] text-white/55">
          <span className="chip">Объектов на карте: {points.length}</span>
          <span className="chip">Тёмный стиль</span>
          <span className="chip">Кликабельные метки</span>
        </div>
      </div>
    </div>
  );
}
