import React, { useEffect, useState } from "react";
import { reviewAPI } from "../../services/api";

const staticFallback = [
  { id: 1, user_name: "राम श्रेष्ठ", rating: 5, comment: "पूजा पसलको सामानहरू धेरै राम्रो छ। घरमा पूजा गर्न सबै चाहिने सामान एकै ठाउँमा पाइन्छ।" },
  { id: 2, user_name: "Sita Sharma", rating: 5, comment: "Excellent quality brass items and very fast delivery. The incense sticks are authentic and long-lasting." },
  { id: 3, user_name: "गीता पौडेल", rating: 5, comment: "धेरै राम्रो सेवा। समयमा डेलिभरी र गुणस्तरीय सामान। सबैलाई सिफारिस गर्छु।" },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(staticFallback);

  useEffect(() => {
    reviewAPI.getAll().then(data => { const list = Array.isArray(data) ? data : (data.results ?? []); if (list.length > 0) setTestimonials(list); }).catch(() => {});
  }, []);

  return (
    <section className="bg-[#FDFBF7] py-20 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4">

        <div className="text-center mb-12" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-red-400" />
            <span className="text-red-600 text-xs font-bold tracking-[0.15em] uppercase">प्रतिक्रिया</span>
            <div className="h-[1px] w-8 bg-red-400" />
          </div>
          {/* Star summary */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-1.5 rounded-full mb-4">
            <span className="text-amber-500 text-sm">★★★★★</span>
            <span className="text-sm font-bold text-[#1B1917]">4.9 / 5</span>
            <span className="text-xs text-[#78716C]">· Rated by 10,000+ families</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1B1917] tracking-tight">
            ग्राहकहरूको <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">प्रतिक्रिया</span>
          </h2>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map(t => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
          {testimonials.slice(0, 6).map(t => (
            <div key={t.id} className="snap-start shrink-0 w-[80vw]">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="bg-white p-7 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] hover:shadow-[0_20px_40px_rgba(217,119,6,0.08)] hover:-translate-y-1.5 transition-all duration-500">
      <div className="flex mb-4 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < t.rating ? 'text-[#D97706]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <p className="text-[#57534E] text-sm leading-relaxed font-medium mb-6">
        <span className="text-[#D97706] text-lg font-serif">"</span>{t.comment}"
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-[#F5F5F4]">
        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#D97706] font-bold border border-orange-100 uppercase text-sm">
          {t.user_name?.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-[#1B1917] text-sm">{t.user_name}</p>
          {t.created_at && <p className="text-[#A8A29E] text-xs">{new Date(t.created_at).toLocaleDateString()}</p>}
        </div>
      </div>
    </div>
  );
}
