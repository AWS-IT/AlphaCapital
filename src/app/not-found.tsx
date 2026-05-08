import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-6 py-24 text-center">
      <div className="max-w-xl">
        <span className="label-eyebrow">404</span>
        <h1 className="mt-4 font-display text-6xl text-white md:text-7xl">
          Страница <span className="gold-text">не найдена</span>
        </h1>
        <p className="mt-5 text-base text-white/65">
          Возможно, страница перемещена или больше не существует. Загляните в
          каталог — там лучшее из новостроек Грозного.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">На главную</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/catalog">В каталог</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
