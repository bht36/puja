import React from "react";

export default function Hero() {
  return (
    <section className="bg-[#F0EDE5] py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-[#C0B8AF] rounded-[12px] p-8 shadow-[0_6px_18px_rgba(30,28,37,0.08)] relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <pattern id="mandala" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="3" fill="#C28142" opacity="0.3"/>
                <path d="M10 7l1 3-1 3-1-3z" fill="#C28142" opacity="0.2"/>
              </pattern>
              <rect width="100" height="100" fill="url(#mandala)"/>
            </svg>
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <input 
                  type="text" 
                  placeholder="havan items, tikka set"
                  className="w-full max-w-md px-4 py-3 rounded-[8px] border border-[#637F95]/30 focus:border-[#C28142] focus:outline-none bg-white/90"
                />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-[#C28142] mb-4" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>
                धार्मिक किनमेल
              </h1>
              <p className="text-xl text-[#1E1C25] mb-8">Begin Your Sacred Rituals Here</p>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1549388604-817d15aa0110?w=400&h=400&fit=crop&crop=center" 
                alt="Brass Diya"
                className="w-80 h-80 object-cover rounded-[12px] shadow-[0_6px_18px_rgba(30,28,37,0.08)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
