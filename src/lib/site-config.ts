export const siteConfig = {
  name: "Lam Capital",
  legalName: "Lam Capital",
  tagline: "Премиальная недвижимость Грозного",
  description:
    "Закрытый клуб премиальной недвижимости Грозного: новостройки от первой линии застройщиков, частные просмотры и сопровождение сделки.",
  city: "Грозный",
  phone: "+7 (000) 000-00-00",
  phoneRaw: "+70000000000",
  email: "info@lamcapital.ru",
  address: "г. Грозный, проспект В.В. Путина",
  workingHours: "Ежедневно, 9:00 — 21:00",
  socials: {
    instagram: "#",
    telegram: "#",
    whatsapp: "#",
  },
  leadsWebhook:
    process.env.NEXT_PUBLIC_LEADS_WEBHOOK ??
    "https://script.google.com/macros/s/AKfycby2GXagAT_i3N_2BHqHobnt2PltED-pbCNIWtjN4gknZSx8AlPTqeAg7-aXeBxQDOL1YQ/exec",
  yandexMapsApiKey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY ?? "",
  defaultMapCenter: { lat: 43.3168, lng: 45.6981 },
} as const;

export type SiteConfig = typeof siteConfig;
