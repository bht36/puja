import React from "react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "राम श्रेष्ठ",
      location: "काठमाडौं",
      text: "पूजा पसलको सामानहरू धेरै राम्रो छ। घरमा पूजा गर्न सबै चाहिने सामान एकै ठाउँमा पाइन्छ।",
      rating: 5
    },
    {
      id: 2,
      name: "Sita Sharma",
      location: "Pokhara",
      text: "Excellent quality brass items and very fast delivery. The incense sticks are authentic and long-lasting.",
      rating: 5
    },
    {
      id: 3,
      name: "गीता पौडेल",
      location: "भक्तपुर",
      text: "धेरै राम्रो सेवा। समयमा डेलिभरी र गुणस्तरीय सामान। सबैलाई सिफारिस गर्छु।",
      rating: 5
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1E1C25] text-center mb-12">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-[#C0B8AF] p-6 rounded-[12px] shadow-[0_6px_18px_rgba(30,28,37,0.08)]"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#C28142]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              
              <p className="text-[#1E1C25] mb-4 italic" style={{fontFamily: testimonial.name.includes('राम') || testimonial.name.includes('गीता') ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif'}}>
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-[#637F95]/20 pt-4">
                <p className="font-semibold text-[#1E1C25]" style={{fontFamily: testimonial.name.includes('राम') || testimonial.name.includes('गीता') ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif'}}>
                  {testimonial.name}
                </p>
                <p className="text-[#637F95] text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
