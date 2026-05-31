import Features from "@/components/shared/Featured";
import HeroSection from "@/components/shared/HeroSection";
import HowItWorks from "@/components/shared/HowItWorks";
import Navbar from "@/components/shared/Navbar";
import PopularTemplates from "@/components/shared/PopularTemplates";
import Pricing from "@/components/shared/Pricing";
import Image from "next/image";

export default function Home() {
  return (
    <div >
      <Navbar />
      <main>
        <HeroSection />
        <Features />
        <HowItWorks />
        <PopularTemplates />
        <Pricing />
      </main>
    </div>
  );
}
