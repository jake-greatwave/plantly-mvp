import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { RecentCompanies } from "@/components/home/RecentCompanies";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />
      <RecentCompanies />
    </div>
  );
}
