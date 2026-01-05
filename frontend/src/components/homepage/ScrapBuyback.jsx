import React from "react";
import { Link } from "react-router-dom";

export default function ScrapBuyback() {
  return (
    <section className="bg-[#F0EDE5] py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white rounded-[12px] p-8 shadow-[0_6px_18px_rgba(30,28,37,0.08)]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Description */}
            <div>
              <h2 className="text-3xl font-bold text-[#C28142] mb-6">Scrap Metal Buyback</h2>
              <p className="text-[#637F95] text-lg mb-6 leading-relaxed">
                Turn your unused brass, bronze, and copper into cash! We offer competitive prices for quality scrap metals with convenient doorstep pickup service.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔶</span>
                  <span className="text-[#1E1C25]">Premium brass materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🟤</span>
                  <span className="text-[#1E1C25]">High-quality bronze items</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🟠</span>
                  <span className="text-[#1E1C25]">Pure copper products</span>
                </div>
              </div>
              
              <Link 
                to="/scrap"
                className="inline-block bg-[#C28142] hover:bg-[#94331F] text-white px-8 py-3 rounded-[8px] font-medium transition-colors"
              >
                Explore Scrap Services
              </Link>
            </div>
            
            {/* Right side - Creative Photo */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-[#C28142] to-[#94331F] rounded-[12px] flex items-center justify-center overflow-hidden">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">♻️</div>
                    <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
                    <p className="text-sm opacity-90">Sustainable metal recycling</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#C0B8AF] rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#637F95] rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
