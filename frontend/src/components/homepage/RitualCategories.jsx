import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RitualCategories() {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

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
    <section className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#1E1C25] mb-8 text-center">Shop by Ritual Sets</h2>
        
        <div className="relative flex items-center justify-center gap-6">
          {totalPages > 1 && (
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <svg className="w-6 h-6 text-[#C28142]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="flex justify-center gap-8 flex-1">
            {currentBundles.map((bundle) => (
              <button
                key={bundle.id}
                onClick={() => navigate(`/bundle/${bundle.id}`)}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                  {bundle.images && bundle.images.length > 0 ? (
                    <img 
                      src={`http://127.0.0.1:8000${bundle.images[0].image}`} 
                      alt={bundle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl">
                      🙏
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-[#1E1C25] text-center max-w-[100px]">
                  {bundle.name}
                </span>
                <span className="text-xs text-[#C28142] font-semibold">
                  NPR {calculateBundlePrice(bundle).toFixed(2)}
                </span>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <svg className="w-6 h-6 text-[#C28142]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#C28142]' : 'bg-[#C0B8AF]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
