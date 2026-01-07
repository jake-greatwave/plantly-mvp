import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { SpotlightCompanies } from "@/components/home/SpotlightCompanies";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <SpotlightCompanies />
    </div>
  );
}
