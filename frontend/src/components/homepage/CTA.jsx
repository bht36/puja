import React from "react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-[#FDFBF7] via-[#F0EDE5] to-[#EBE5D9] rounded-[32px] p-10 lg:p-16 text-center border border-[#E7E5E4] shadow-[0_20px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          
          {/* Decorative Corner Mandala Elements */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-red-200/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1B1917] mb-6 tracking-tight" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>
              पवित्र यात्रा सुरु गर्न <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">तयार हुनुहुन्छ?</span>
            </h2>
            <p className="text-[#78716C] text-lg lg:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              तपाईंको आध्यात्मिक अभ्यासका लागि आवश्यक सम्पूर्ण सामाग्रीहरू। 
              सबै शुद्धता र समर्पणका साथ घरमै डेलिभर गरिन्छ। (Discover authentic items delivered with devotion.)
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button 
                onClick={() => navigate('/categories')}
                className="w-full sm:w-auto px-10 py-4.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_8px_20px_rgb(239,68,68,0.2)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.3)] hover:-translate-y-0.5"
                style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}
              >
                अहिले खरिद गर्नुहोस् (Shop Now)
              </button>
              <button 
                className="w-full sm:w-auto px-10 py-4.5 bg-white border border-[#E7E5E4] hover:border-orange-200 hover:bg-orange-50 text-[#1B1917] rounded-2xl font-bold text-lg transition-all"
                style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}
              >
                थप जानकारी (Learn More)
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-[#E7E5E4]/60 pt-12">
              <div>
                <div className="text-4xl font-extrabold text-[#D97706] mb-2 tracking-tight">१०,०००+</div>
                <p className="text-[#78716C] text-sm font-bold uppercase tracking-wider" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>सन्तुष्ट ग्राहकहरू</p>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-[#D97706] mb-2 tracking-tight">५००+</div>
                <p className="text-[#78716C] text-sm font-bold uppercase tracking-wider" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>उपलब्ध सामाग्रीहरू</p>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-[#D97706] mb-2 tracking-tight">२४ घण्टा</div>
                <p className="text-[#78716C] text-sm font-bold uppercase tracking-wider" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>ग्राहक सेवा</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
