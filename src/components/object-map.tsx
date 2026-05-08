"use client";

import * as React from "react";
import { Compass, MapPin } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

export type MapPoint = {
  id: number;
  title: string;
  lat: number;
  lng: number;
  href?: string;
  price?: string;
  image?: string;
  deliveryDate?: string;
};

type Props = {
  points: MapPoint[];
  zoom?: number;
  height?: number;
};

declare global {
  interface Window {
    ymaps?: any;
    __ymapsLoader?: Promise<any>;
  }
}

const DARK_STYLE = [
  { tags: "country", elements: "geometry", stylers: [{ color: "#0b1830" }] },
  {
    tags: "country",
    elements: "label",
    stylers: [{ color: "#9aaccb", saturation: -0.4 }],
  },
  { tags: "water", stylers: [{ color: "#0a162a" }] },
  { tags: "park", stylers: [{ color: "#152a4a" }] },
  {
    tags: ["road", "road_minor", "road_unclassified"],
    elements: "geometry",
    stylers: [{ color: "#1c2c4a" }],
  },
  {
    tags: ["road", "road_minor", "road_unclassified"],
    elements: "label",
    stylers: [{ color: "#677fae" }],
  },
  { tags: "building", stylers: [{ color: "#13243e" }] },
  { tags: ["transit", "transit_stop"], stylers: [{ visibility: "off" }] },
];

function loadYmaps(apiKey: string) {
  if (typeof window === "undefined") return Promise.reject();
  if (window.ymaps) return Promise.resolve(window.ymaps);
  if (window.__ymapsLoader) return window.__ymapsLoader;

  window.__ymapsLoader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const params = new URLSearchParams({
      lang: "ru_RU",
      load: "package.full",
    });
    if (apiKey) params.set("apikey", apiKey);
    script.src = `https://api-maps.yandex.ru/2.1/?${params.toString()}`;
    script.async = true;
    script.onload = () => {
      window.ymaps?.ready(() => resolve(window.ymaps));
    };
    script.onerror = () =>
      reject(new Error("Не удалось загрузить Яндекс.Карты"));
    document.head.appendChild(script);
  });
  return window.__ymapsLoader;
}

export function ObjectMap({ points, zoom = 12, height = 560 }: Props) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  const [active, setActive] = React.useState<MapPoint | null>(null);
  const [popup, setPopup] = React.useState<{ x: number; y: number } | null>(null);
  const mapInstance = React.useRef<any>(null);
  const placemarksRef = React.useRef<Map<number, any>>(new Map());

  // Reposition popup as user pans/zooms.
  const reposition = React.useCallback((p: MapPoint) => {
    const map = mapInstance.current;
    if (!map) return;
    const projection = map.options.get("projection");
    const globalPx = projection.toGlobalPixels(
      [p.lat, p.lng],
      map.getZoom(),
    );
    const offset = map.getGlobalPixelCenter();
    const size = map.container.getSize();
    const x = globalPx[0] - offset[0] + size[0] / 2;
    const y = globalPx[1] - offset[1] + size[1] / 2;
    setPopup({ x, y });
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const center = points.length
      ? [points[0].lat, points[0].lng]
      : [siteConfig.defaultMapCenter.lat, siteConfig.defaultMapCenter.lng];

    loadYmaps(siteConfig.yandexMapsApiKey)
      .then((ymaps) => {
        if (cancelled || !mapRef.current) return;

        const map = new ymaps.Map(
          mapRef.current,
          {
            center,
            zoom,
            controls: ["zoomControl"],
          },
          { suppressMapOpenBlock: true },
        );
        mapInstance.current = map;

        ymaps.layout.storage.add(
          "ac#pin",
          ymaps.templateLayoutFactory.createClass(
            `<div class="ac-pin">
                <div class="ac-pin__dot"></div>
                <div class="ac-pin__pulse"></div>
                <div class="ac-pin__label">$[properties.iconCaption]</div>
              </div>`,
          ),
        );

        points.forEach((p) => {
          const placemark = new ymaps.Placemark(
            [p.lat, p.lng],
            {
              hintContent: p.title,
              iconCaption: p.title.replace(/^ЖК\s+/i, ""),
            },
            {
              iconLayout: "ac#pin",
              iconShape: {
                type: "Circle",
                coordinates: [0, 0],
                radius: 16,
              },
              hideIconOnBalloonOpen: false,
            },
          );

          placemark.events.add("click", () => {
            setActive(p);
            // Center the marker so the card is fully visible.
            map.panTo([p.lat, p.lng], { flying: true, duration: 350 });
            window.setTimeout(() => reposition(p), 360);
          });

          map.geoObjects.add(placemark);
          placemarksRef.current.set(p.id, placemark);
        });

        try {
          (map.options as any).set("mapStyle", { name: "Alpha", style: DARK_STYLE });
        } catch {
          /* ignore */
        }

        if (points.length > 1) {
          const bounds = map.geoObjects.getBounds();
          if (bounds) {
            map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 70 });
          }
        }

        map.events.add(["boundschange", "actionend"], () => {
          setActive((cur) => {
            if (cur) reposition(cur);
            return cur;
          });
        });

        // Click on empty map area closes the card.
        map.events.add("click", () => {
          setActive(null);
          setPopup(null);
        });

        setReady(true);
      })
      .catch((e) => setError(e.message || "Карта недоступна"));

    return () => {
      cancelled = true;
      try {
        mapInstance.current?.destroy();
      } catch {
        /* noop */
      }
      mapInstance.current = null;
      placemarksRef.current.clear();
    };
  }, [points, zoom, reposition]);

  return (
    <div className="relative isolate w-full overflow-hidden bg-midnight-950">
      <style>{`
        .ac-pin{position:relative;transform:translate(-50%, -100%);display:grid;place-items:center;cursor:pointer}
        .ac-pin__dot{width:14px;height:14px;border-radius:9999px;background:#c9a86a;box-shadow:0 0 0 4px rgba(201,168,106,0.18),0 8px 22px rgba(201,168,106,0.4);transition:transform .25s ease}
        .ac-pin:hover .ac-pin__dot{transform:scale(1.15)}
        .ac-pin__pulse{position:absolute;inset:auto;width:36px;height:36px;border-radius:9999px;border:1px solid rgba(201,168,106,0.5);animation:acpulse 1.8s ease-out infinite}
        .ac-pin__label{margin-top:8px;font-size:11px;letter-spacing:.04em;color:#0a162a;background:#e3cb98;padding:2px 8px;border-radius:9999px;white-space:nowrap;font-weight:600;box-shadow:0 8px 22px rgba(0,0,0,0.4)}
        @keyframes acpulse{0%{transform:scale(0.7);opacity:.7}100%{transform:scale(1.4);opacity:0}}
      `}</style>
      <div
        ref={mapRef}
        className="w-full"
        style={{ height: `${height}px` }}
        aria-label="Карта объектов"
      />
      {active && popup && (
        <MapCard
          point={active}
          x={popup.x}
          y={popup.y}
          onClose={() => {
            setActive(null);
            setPopup(null);
          }}
        />
      )}
      {!ready && !error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-midnight-950/70 text-white/60">
          <div className="flex items-center gap-3 text-sm">
            <Compass className="h-4 w-4 animate-spin text-gold" /> Загружаем карту…
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-midnight-950/85 px-6 text-center text-white/75">
          <div className="max-w-md">
            <MapPin className="mx-auto h-6 w-6 text-gold" />
            <p className="mt-3 text-sm">
              Карта временно недоступна. Убедитесь, что задан ключ
              <code className="mx-1 rounded bg-white/10 px-1 py-0.5 text-[12px]">
                NEXT_PUBLIC_YANDEX_MAPS_API_KEY
              </code>
              в файле .env.local.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MapCard({
  point,
  x,
  y,
  onClose,
}: {
  point: MapPoint;
  x: number;
  y: number;
  onClose: () => void;
}) {
  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
    >
      <div
        className="pointer-events-auto -translate-x-1/2 -translate-y-[calc(100%+24px)] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-midnight-900/95 shadow-elevated backdrop-blur-xl">
          {point.image && (
            <div className="relative h-[150px] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={point.image}
                alt={point.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/85 to-transparent" />
              <button
                aria-label="Закрыть"
                onClick={onClose}
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-midnight-950/70 text-white/85 transition hover:bg-midnight-950 hover:text-white"
              >
                ×
              </button>
              <div className="absolute inset-x-4 bottom-3">
                <div className="font-display text-[10px] uppercase tracking-[0.32em] text-gold">
                  Жилой комплекс
                </div>
                <div className="mt-0.5 line-clamp-1 font-display text-xl leading-tight text-white">
                  {point.title.replace(/^ЖК\s+/i, "")}
                </div>
              </div>
            </div>
          )}
          <div className="space-y-3 p-4">
            {!point.image && (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-[10px] uppercase tracking-[0.32em] text-gold">
                    Жилой комплекс
                  </div>
                  <div className="mt-1 font-display text-xl leading-tight text-white">
                    {point.title.replace(/^ЖК\s+/i, "")}
                  </div>
                </div>
                <button
                  aria-label="Закрыть"
                  onClick={onClose}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 hover:text-white"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.16em] text-white/55">
              {point.deliveryDate && <span>{point.deliveryDate}</span>}
              {point.price && (
                <span className="text-white/85">{point.price}</span>
              )}
            </div>
            {point.href && (
              <a
                href={point.href}
                className="btn-gold w-full justify-center text-sm"
              >
                Подробнее
              </a>
            )}
          </div>
          <div
            aria-hidden
            className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-midnight-900/95"
          />
        </div>
      </div>
    </div>
  );
}
