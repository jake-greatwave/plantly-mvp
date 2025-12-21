import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedCompanies } from "@/components/home/FeaturedCompanies";
import { StatsSection } from "@/components/home/StatsSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <FeaturedCompanies />
      <StatsSection />
      <CTASection />
    </div>
  );
}
