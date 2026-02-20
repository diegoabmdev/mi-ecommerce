// app/page.tsx
import { Hero } from "@/components/hero/HeroSection";
import { CategoryGrid } from "@/components/hero/CategoryGrid";
import { FlashSales } from "@/components/hero/FlashSales";
import BenefitsSection from "@/components/hero/BenefitsSection";
import Promotional from "@/components/hero/Promotional";
import { BestSellers } from "@/components/hero/BestSellers";
import NewsSection from "@/components/hero/NewsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Hero />
      <div className="max-w-340 px-4 lg:px-10 mx-auto space-y-20 mt-12">
        <BenefitsSection />
        <CategoryGrid />
        <FlashSales />
        <NewsSection />
        <Promotional />
        <BestSellers />
      </div>
    </div>
  );
}
