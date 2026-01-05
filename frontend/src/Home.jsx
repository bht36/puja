import React from "react";
import { Header, Hero, RitualCategories, ScrapBuyback, ProductGrid, Testimonials, CTA, Footer } from "./components/homepage";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F0EDE5] text-[#1E1C25]" style={{fontFamily: 'Inter, Noto Sans, sans-serif'}}>
      <Header />
      <main>
        <Hero />
        <RitualCategories />
        <ScrapBuyback />
        <ProductGrid />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
