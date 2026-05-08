import { Hero } from "@/components/hero";
import { HotSlider } from "@/components/hot-slider";
import { Advantages } from "@/components/advantages";
import { PopularObjects } from "@/components/popular-objects";
import { CallToAction } from "@/components/cta";
import { getHotObjects, getObjects } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [all, hot] = await Promise.all([getObjects(), getHotObjects()]);
  const heroFeature = hot[0] ?? all[0] ?? null;

  // popular = first six with both image + description that aren't the hero feature
  const popular = all
    .filter(
      (o) =>
        o.id !== heroFeature?.id &&
        o.shortDescription &&
        o.shortDescription.length > 12,
    )
    .slice(0, 6);

  return (
    <div className="space-y-32 pb-32">
      <Hero feature={heroFeature} />
      {hot.length > 0 && <HotSlider items={hot} />}
      <Advantages />
      <PopularObjects items={popular} />
      <CallToAction />
    </div>
  );
}
