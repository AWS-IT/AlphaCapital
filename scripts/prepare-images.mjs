// Copies images from /objectImg into /public/objects, and rewrites
// objects.json so each entry has an `image` path that resolves under /public.
// Safe to run multiple times.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "objectImg");
const DEST_DIR = path.join(ROOT, "public", "objects");
const JSON_PATH = path.join(ROOT, "data", "objects.json");
const ORIGINAL_JSON = path.join(ROOT, "objects.json");

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source images directory not found: ${SRC_DIR}`);
  process.exit(1);
}

fs.mkdirSync(DEST_DIR, { recursive: true });
fs.mkdirSync(path.dirname(JSON_PATH), { recursive: true });

// Copy images (preserving original case, do not overwrite if identical size).
const files = fs.readdirSync(SRC_DIR);
for (const file of files) {
  const from = path.join(SRC_DIR, file);
  const to = path.join(DEST_DIR, file);
  if (
    !fs.existsSync(to) ||
    fs.statSync(from).size !== fs.statSync(to).size
  ) {
    fs.copyFileSync(from, to);
  }
}

const buildIndex = () => {
  const map = new Map();
  for (const f of files) {
    map.set(f.toLowerCase(), f);
    map.set(path.parse(f).name.toLowerCase(), f);
  }
  return map;
};

const index = buildIndex();

const sourceJson = fs.existsSync(JSON_PATH) ? JSON_PATH : ORIGINAL_JSON;
const raw = fs.readFileSync(sourceJson, "utf8");
const data = JSON.parse(raw);

const resolveImage = (originalPath) => {
  if (!originalPath || typeof originalPath !== "string") return null;
  const base = path.basename(originalPath);
  const candidates = [
    base,
    base.toLowerCase(),
    path.parse(base).name,
    path.parse(base).name.toLowerCase(),
  ];
  for (const c of candidates) {
    if (index.has(c.toLowerCase())) {
      return `/objects/${index.get(c.toLowerCase())}`;
    }
  }
  return null;
};

let unresolved = 0;
const normalized = data
  .filter((item) => item && item.id != null)
  .map((item) => {
    const image = resolveImage(item.image);
    if (!image) {
      unresolved += 1;
      console.warn(
        `! No image found for id=${item.id} title="${item.title}" original="${item.image}"`,
      );
    }
    return {
      id: item.id,
      title: (item.title || "").trim(),
      image: image || "/objects/placeholder.svg",
      shortDescription: (item.shortDescription || "").trim(),
      price: (item.price || "").trim(),
      deliveryDate: (item.deliveryDate || "").trim(),
      floors: (item.floors || "").trim(),
      commercialFloors: (item.commercialFloors || "").trim(),
      parking: (item.parking || "").trim(),
      description: (item.description || "").trim(),
      hot: Boolean(item.hot),
      latitude: typeof item.latitude === "number" ? item.latitude : null,
      longitude: typeof item.longitude === "number" ? item.longitude : null,
    };
  });

fs.writeFileSync(JSON_PATH, JSON.stringify(normalized, null, 2), "utf8");

console.log(
  `Normalized ${normalized.length} objects. Unresolved images: ${unresolved}.`,
);
console.log(`Wrote ${JSON_PATH}`);
console.log(`Copied ${files.length} images into ${DEST_DIR}`);
