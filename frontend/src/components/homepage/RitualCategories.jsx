import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RitualCategories() {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/bundles/')
      .then(res => res.json())
      .then(data => setBundles(data))
      .catch(err => console.error('Error fetching bundles:', err));
  }, []);

  const totalPages = Math.ceil(bundles.length / itemsPerPage);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalPages);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const currentBundles = bundles.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const calculateBundlePrice = (bundle) => {
    if (!bundle.items || bundle.items.length === 0) return 0;
    return bundle.items.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  return (
    <section className="py-20 bg-[#FCFAF8] relative overflow-hidden">
      {/* Very faint background mandala for aesthetics */}
      <div className="absolute -top-40 -right-40 w-96 h-96 border-[1px] border-orange-200/50 rounded-full opacity-20 pointer-events-none"></div>
      <div className="absolute top-20 -left-20 w-64 h-64 border-[1px] border-red-200/50 rounded-full opacity-20 pointer-events-none"></div>

      <div className="max-w-[1240px] mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1B1917] mb-4 tracking-tight">
            विशेष <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">पूजा सेटहरू</span>
          </h2>
          <p className="text-[#78716C] font-medium text-lg max-w-2xl mx-auto">
            तपाईंको आवश्यकता अनुसार तयार पारिएका सम्पूर्ण पूजा सामग्रीका प्याकेजहरू
          </p>
        </div>
        
        {/* Creative Circular Carousel Section */}
        <div className="relative flex items-center justify-center gap-2 lg:gap-6 px-1 lg:px-6">
          {totalPages > 1 && (
            <button
              onClick={prevSlide}
              className="absolute -left-2 lg:left-0 z-20 p-3 lg:p-4 rounded-full bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.2)] hover:text-red-500 text-[#A8A29E] transition-all hover:-translate-x-1 border border-orange-50"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="flex justify-center gap-8 lg:gap-16 flex-1 overflow-hidden py-8">
            {currentBundles.map((bundle) => (
              <div
                key={bundle.id}
                onClick={() => navigate(`/bundle/${bundle.id}`)}
                className="group relative flex flex-col items-center cursor-pointer w-[140px] lg:w-[220px]"
              >
                {/* The "Thali" (Plate/Halo) Circle */}
                <div className="relative w-32 h-32 lg:w-48 lg:h-48 rounded-full p-1.5 lg:p-2 bg-gradient-to-tr from-orange-200 via-red-100 to-orange-50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_40px_rgba(217,119,6,0.2)] transition-all duration-500 group-hover:-translate-y-3">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative bg-white">
                    {bundle.images && bundle.images.length > 0 ? (
                      <img 
                        src={`http://127.0.0.1:8000${bundle.images[0].image}`} 
                        alt={bundle.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center text-red-300 text-5xl">
                        🕉️
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                  </div>
                  
                  {/* Floating Overlapping Price Pill */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 lg:px-5 py-1.5 lg:py-2 rounded-full shadow-lg border border-red-50 flex items-center gap-1.5 z-10 group-hover:border-red-200 transition-colors duration-300 whitespace-nowrap">
                    <span className="text-[10px] lg:text-xs text-[#A8A29E] font-bold uppercase tracking-wider">NPR</span>
                    <span className="text-sm lg:text-base font-extrabold text-[#D97706] tracking-tight">
                      {calculateBundlePrice(bundle).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                
                {/* Text Content Below */}
                <div className="mt-8 lg:mt-10 text-center px-2">
                  <h3 className="text-sm lg:text-lg font-bold text-[#1B1917] group-hover:text-red-600 transition-colors line-clamp-2 leading-snug" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>
                    {bundle.name}
                  </h3>
                  {/* Delicate ornamental divider */}
                  <div className="mt-3 w-8 h-[2px] bg-red-200 mx-auto group-hover:bg-red-500 group-hover:w-12 transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <button
              onClick={nextSlide}
              className="absolute -right-2 lg:right-0 z-20 p-3 lg:p-4 rounded-full bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(239,68,68,0.2)] hover:text-red-500 text-[#A8A29E] transition-all hover:translate-x-1 border border-orange-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Carousel Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-red-500 w-8' 
                    : 'bg-[#E7E5E4] hover:bg-red-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
