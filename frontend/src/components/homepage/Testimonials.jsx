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
    reviewAPI.getAll().then(data => {
      if (data.length > 0) setTestimonials(data);
    }).catch(() => {});
  }, []);

  return (
    <section className="bg-[#FDFBF7] py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 border-[1px] border-orange-200/40 rounded-full opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 border-[1px] border-red-200/30 rounded-full opacity-30 translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-[1240px] mx-auto px-4 relative z-10">
        <div className="text-center mb-16" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-black/10"></div>
            <span className="text-red-600 text-sm font-bold tracking-[0.2em] uppercase">प्रतिक्रिया</span>
            <div className="h-[1px] w-8 bg-black/10"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1B1917] mb-4 tracking-tight">
            ग्राहकहरूको <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">प्रतिक्रिया</span>
          </h2>
          <p className="text-[#78716C] font-medium text-lg">What Our Customers Say</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.slice(0, 6).map((t) => (
            <div key={t.id}
              className="bg-white p-8 lg:p-10 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#F5F5F4] hover:shadow-[0_20px_40px_rgba(217,119,6,0.08)] hover:-translate-y-2 transition-all duration-500 relative group">
              <div className="absolute top-6 right-8 opacity-[0.03] text-8xl font-serif text-[#C28142] group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">"</div>
              <div className="flex mb-6 gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < t.rating ? 'text-[#D97706]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[#57534E] mb-8 text-lg leading-relaxed font-medium relative z-10">"{t.comment}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-[#F5F5F4]">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#D97706] font-bold text-xl border border-orange-100 uppercase">
                  {t.user_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-[#1B1917] text-[15px]">{t.user_name}</p>
                  {t.created_at && <p className="text-[#A8A29E] text-xs font-bold uppercase tracking-wider mt-0.5">{new Date(t.created_at).toLocaleDateString()}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
