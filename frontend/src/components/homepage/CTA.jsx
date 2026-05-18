import React from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#FBF8F3] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-gradient-to-br from-[#FDFBF7] via-[#F0EDE5] to-[#EBE5D9] rounded-[32px] p-10 lg:p-16 text-center border border-[#E7E5E4] shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">

          <div className="absolute -top-16 -left-16 w-48 h-48 bg-orange-200/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-red-200/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-red-400" />
              <span className="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">आजै सुरु गर्नुहोस्</span>
              <div className="h-[1px] w-8 bg-red-400" />
            </div>

            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#1B1917] mb-6 tracking-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              पवित्र यात्रा सुरु गर्न <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">तयार हुनुहुन्छ?</span>
            </h2>
            <p className="text-[#78716C] text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              तपाईंको आध्यात्मिक अभ्यासका लागि आवश्यक सम्पूर्ण सामाग्रीहरू — सबै शुद्धता र समर्पणका साथ घरमै डेलिभर।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <button onClick={() => navigate('/categories')}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-base transition-all shadow-[0_8px_20px_rgb(239,68,68,0.2)] hover:-translate-y-0.5"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                अहिले खरिद गर्नुहोस्
              </button>
              <Link to="/about"
                className="px-10 py-4 bg-white border border-[#E7E5E4] hover:border-orange-200 hover:bg-orange-50 text-[#1B1917] rounded-full font-bold text-base transition-all"
                style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                थप जानकारी →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 border-t border-[#E7E5E4]/60 pt-10">
              {[["98%", "सन्तुष्टि दर"], ["48 hrs", "औसत डेलिभरी"], ["500+", "उपलब्ध सामाग्री"]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-3xl lg:text-4xl font-extrabold text-[#D97706] mb-1">{val}</div>
                  <p className="text-[#78716C] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
