import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { getObjects } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Каталог объектов",
  description:
    "Полный каталог жилых комплексов и резиденций Грозного с фильтрами и поиском.",
};

export default async function CatalogPage() {
  const objects = await getObjects();
  return (
    <div className="pt-[80px]">
      <header className="container-x mb-12 max-w-3xl">
        <span className="label-eyebrow">Каталог</span>
        <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">
          Все объекты <span className="gold-text">Alpha Capital</span>
        </h1>
        <p className="mt-5 text-base text-white/65">
          Найдите подходящий жилой комплекс по локации, цене, срокам сдачи или
          уникальным характеристикам.
        </p>
      </header>
      <Catalog items={objects} />
    </div>
  );
}
