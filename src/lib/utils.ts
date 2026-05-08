import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractPriceNumber(price: string): number | null {
  if (!price) return null;
  const cleaned = price.replace(/ |\s/g, "").replace(/[.,](?=\d{3}\b)/g, "");
  const match = cleaned.match(/(\d{4,})/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

export function extractFloors(floors: string): number | null {
  if (!floors) return null;
  const numbers = Array.from(floors.matchAll(/(\d+)/g)).map((m) => Number(m[1]));
  if (numbers.length === 0) return null;
  return Math.max(...numbers);
}

export function extractDeliveryYear(date: string): number | null {
  if (!date) return null;
  const m = date.match(/(20\d{2})/);
  return m ? Number(m[1]) : null;
}

export function formatPrice(price: string): string {
  return price?.trim() || "Цена по запросу";
}

export function maskRussianPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (!digits.startsWith("7")) digits = "7" + digits;
  digits = digits.slice(0, 11);

  const part = (a: number, b: number) => digits.slice(a, b);
  let result = "+7";
  if (digits.length > 1) result += " (" + part(1, 4);
  if (digits.length >= 4) result += ") " + part(4, 7);
  if (digits.length >= 7) result += "-" + part(7, 9);
  if (digits.length >= 9) result += "-" + part(9, 11);
  return result;
}

export function isValidRussianPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  return digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"));
}

export function smoothScrollTo(selector: string) {
  if (typeof window === "undefined") return;
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function truncate(text: string, max: number) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}
