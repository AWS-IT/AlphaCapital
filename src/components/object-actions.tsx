"use client";

import { Phone } from "lucide-react";

import type { RealEstateObject } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useLeadModal } from "@/components/lead-modal";
import { siteConfig } from "@/lib/site-config";

export function ObjectActions({ object }: { object: RealEstateObject }) {
  const { open } = useLeadModal();

  return (
    <div className="flex flex-col gap-3">
      <Button
        size="lg"
        onClick={() =>
          open({
            source: "object-page",
            objectId: object.id,
            objectTitle: object.title,
            title: "Запись на просмотр",
            description: `${object.title}: согласуем удобное время и приватный визит.`,
          })
        }
      >
        Записаться на просмотр
      </Button>
      <Button
        variant="ghost"
        size="lg"
        onClick={() =>
          open({
            source: "object-page",
            objectId: object.id,
            objectTitle: object.title,
            title: "Получить презентацию",
            description: `Пришлём подборку планировок и условий по ${object.title}.`,
          })
        }
      >
        Получить презентацию
      </Button>
      <a
        href={`tel:${siteConfig.phoneRaw}`}
        className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm text-white/65 transition hover:text-white"
      >
        <Phone className="h-4 w-4 text-gold" /> {siteConfig.phone}
      </a>
    </div>
  );
}
