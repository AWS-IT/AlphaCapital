"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-md">
        <span className="label-eyebrow">Ошибка</span>
        <h1 className="mt-4 font-display text-4xl text-white">
          Что-то пошло не так
        </h1>
        <p className="mt-4 text-sm text-white/65">
          Мы уже знаем о проблеме. Попробуйте обновить страницу или повторить
          действие.
        </p>
        <Button onClick={reset} className="mt-7">
          Попробовать снова
        </Button>
      </div>
    </div>
  );
}
