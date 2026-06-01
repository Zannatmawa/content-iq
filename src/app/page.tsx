import Features from "@/components/shared/Featured";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/shared/HeroSection";
import HowItWorks from "@/components/shared/HowItWorks";
import Navbar from "@/components/shared/Navbar";
import NewsletterSignup from "@/components/shared/Newsletter";
import PopularTemplates from "@/components/shared/PopularTemplates";
import Pricing from "@/components/shared/Pricing";
import Statistics from "@/components/shared/Statistics";
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
        <Statistics />
        <NewsletterSignup />
        <Footer />
      </main>
    </div>
  );
}
