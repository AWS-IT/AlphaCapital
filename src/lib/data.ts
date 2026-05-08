import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type { AdminOverrides, RealEstateObject } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const OBJECTS_PATH = path.join(DATA_DIR, "objects.json");
const OVERRIDES_PATH = path.join(DATA_DIR, "overrides.json");

let objectsCache: RealEstateObject[] | null = null;

export async function getRawObjects(): Promise<RealEstateObject[]> {
  if (objectsCache) return objectsCache;
  const raw = await fs.readFile(OBJECTS_PATH, "utf8");
  const data = JSON.parse(raw) as RealEstateObject[];
  objectsCache = data;
  return data;
}

export function invalidateObjectsCache() {
  objectsCache = null;
}

export async function readOverrides(): Promise<AdminOverrides> {
  try {
    const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
    const parsed = JSON.parse(raw) as AdminOverrides;
    return {
      hotIds: Array.isArray(parsed.hotIds) ? parsed.hotIds : [],
      hotOrder: Array.isArray(parsed.hotOrder) ? parsed.hotOrder : [],
      customTexts: parsed.customTexts ?? {},
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return {
      hotIds: [],
      hotOrder: [],
      customTexts: {},
      updatedAt: new Date(0).toISOString(),
    };
  }
}

export async function writeOverrides(next: AdminOverrides) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    OVERRIDES_PATH,
    JSON.stringify({ ...next, updatedAt: new Date().toISOString() }, null, 2),
    "utf8",
  );
}

export async function getObjects(): Promise<RealEstateObject[]> {
  const [base, overrides] = await Promise.all([
    getRawObjects(),
    readOverrides(),
  ]);
  const customSet = new Set(overrides.hotIds);
  return base.map((obj) => {
    const custom = overrides.customTexts[String(obj.id)];
    return {
      ...obj,
      hot: customSet.size > 0 ? customSet.has(obj.id) : obj.hot,
      title: custom?.title ?? obj.title,
      shortDescription: custom?.shortDescription ?? obj.shortDescription,
    };
  });
}

export async function getObjectById(
  id: number,
): Promise<RealEstateObject | undefined> {
  const list = await getObjects();
  return list.find((o) => o.id === id);
}

export async function getHotObjects(): Promise<RealEstateObject[]> {
  const [list, overrides] = await Promise.all([getObjects(), readOverrides()]);
  const hot = list.filter((o) => o.hot);
  if (overrides.hotOrder.length === 0) return hot;
  const orderMap = new Map(overrides.hotOrder.map((id, i) => [id, i]));
  return [...hot].sort((a, b) => {
    const ai = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 1e9;
    const bi = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 1e9;
    return ai - bi;
  });
}

export async function getMappedObjects(): Promise<RealEstateObject[]> {
  const list = await getObjects();
  return list.filter(
    (o) => typeof o.latitude === "number" && typeof o.longitude === "number",
  );
}
