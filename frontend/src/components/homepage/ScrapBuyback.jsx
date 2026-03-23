import React from "react";
import { Link } from "react-router-dom";

export default function ScrapBuyback() {
  return (
    <section className="bg-[#F0EDE5] py-20 relative overflow-hidden">
      {/* Decorative large circle in background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-[1240px] mx-auto px-4 relative z-10">
        <div className="bg-white rounded-[32px] p-8 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden">

          {/* Subtle pattern background inside card */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D97706 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">

            {/* Left side - Storytelling Content */}
            <div style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>


              <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1B1917] mb-6 leading-[1.2] tracking-tight">
                पवित्र धातुको <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">पुनर्जन्म</span>
              </h2>

              <p className="text-[#57534E] text-lg lg:text-xl mb-8 leading-relaxed font-medium">
                तपाईंका पुराना, प्रयोगविहीन पित्तल, तामा र काँसका सामग्रीहरूलाई नयाँ पवित्र रूप दिनुहोस्। हामी हाम्रा परम्पराहरूलाई जोगाउँदै पुराना धातुहरूको उचित मूल्य प्रदान गर्दछौं।
              </p>

              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-4 bg-[#F9F7F4] p-4 rounded-2xl border border-[#F0EDE5] hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-xl shrink-0 text-orange-500">
                    💰
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1917] text-lg">उच्च मूल्य</h4>
                    <p className="text-sm text-[#78716C]">तपाईंको सामग्रीको तौल अनुसार उत्कृष्ट बजार भाउ</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#F9F7F4] p-4 rounded-2xl border border-[#F0EDE5] hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-xl shrink-0 text-red-500">
                    🚚
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1917] text-lg">घरमै आएर लिने सुविधा</h4>
                    <p className="text-sm text-[#78716C]">तपाईंको ढोकाबाटै सुरक्षित संकलन</p>
                  </div>
                </div>
              </div>

              <Link
                to="/scrap"
                className="inline-flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 active:scale-95 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_8px_30px_rgb(239,68,68,0.3)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.5)] w-full sm:w-auto"
              >
                स्क्र्याप सेवा हेर्नुहोस्
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            {/* Right side - Creative Premium Presentation */}
            <div className="relative">
              {/* Decorative background shape */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-red-100 rounded-[40px] transform -rotate-3 scale-105 opacity-50"></div>

              {/* Main Image Container */}
              <div className="relative h-[400px] lg:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1610444558552-32b00fdfbd88?w=800&h=1000&fit=crop"
                  alt="Vintage Brass and Copper"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Floating Eco Badge over image */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-white flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-inner text-2xl shrink-0">
                    ♻️
                  </div>
                  <div>
                    <p className="text-[#1B1917] font-bold text-lg leading-tight mb-0.5">नयाँ जीवन</p>
                    <p className="text-[#78716C] text-sm font-medium">परम्परा र प्रकृतिको संरक्षण गर्दै १००% धातु रिसाइक्लिङ</p>
                  </div>
                </div>
              </div>


            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
