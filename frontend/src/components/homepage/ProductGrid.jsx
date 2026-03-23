import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [grids, setGrids] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/product-grids/')
      .then(res => res.json())
      .then(data => {
        const gridPromises = data.map(grid =>
          fetch(`http://127.0.0.1:8000/api/products/?grid=${grid.id}`)
            .then(res => res.json())
            .then(products => ({ ...grid, products }))
        );
        return Promise.all(gridPromises);
      })
      .then(gridsWithProducts => setGrids(gridsWithProducts))
      .catch(err => console.error('Error fetching grids:', err));
  }, []);

  return (
    <div className="bg-[#F0EDE5] py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        {grids.map(grid => (
          <ProductSection 
            key={grid.id}
            title={grid.title} 
            products={grid.products} 
            sectionId={`grid-${grid.id}`} 
          />
        ))}

        <section className="mt-20">
          <div className="text-center mb-12" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1B1917] mb-4">
              आध्यात्मिक <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">ज्ञान र मार्गदर्शन</span>
            </h2>
            <p className="text-[#78716C] font-medium text-lg">Spiritual Insights and Guides</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)] transition-all duration-500 border border-[#F5F5F4] hover:-translate-y-2 group cursor-pointer text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-[16px] flex items-center justify-center mb-6 text-3xl mx-auto group-hover:scale-110 group-hover:bg-red-50 transition-all duration-500">
                📖
              </div>
              <h3 className="text-xl font-bold text-[#1B1917] mb-3 font-sans group-hover:text-red-600 transition-colors" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>पूजा विधि (Puja Vidhi)</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">विभिन्न परम्परागत हिन्दू अनुष्ठान र पूजाहरूको विस्तृत चरणबद्ध मार्गदर्शन। (Step-by-step guides for traditional Hindu rituals)</p>
            </div>
            
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)] transition-all duration-500 border border-[#F5F5F4] hover:-translate-y-2 group cursor-pointer text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-[16px] flex items-center justify-center mb-6 text-3xl mx-auto group-hover:scale-110 group-hover:bg-red-50 transition-all duration-500">
                🕉️
              </div>
              <h3 className="text-xl font-bold text-[#1B1917] mb-3 group-hover:text-red-600 transition-colors" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>मन्त्र तथा श्लोक (Mantras)</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">पवित्र मन्त्रहरू, तिनको अर्थ र दैनिक जीवनमा उच्चारणको महत्त्व। (Sacred chants and their meanings)</p>
            </div>
            
            <div className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)] transition-all duration-500 border border-[#F5F5F4] hover:-translate-y-2 group cursor-pointer text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-[16px] flex items-center justify-center mb-6 text-3xl mx-auto group-hover:scale-110 group-hover:bg-red-50 transition-all duration-500">
                📅
              </div>
              <h3 className="text-xl font-bold text-[#1B1917] mb-3 group-hover:text-red-600 transition-colors" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>चाडपर्व क्यालेन्डर (Calendar)</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">वर्षभरिका महत्त्वपूर्ण चाडबाड, तिथि र उत्सवहरूको जानकारी। (Important dates and celebrations)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProductSection({ title, products, sectionId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalPages);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const currentProducts = products.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  if (products.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#1B1917] tracking-tight" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>{title}</h2>
        <button className="text-[#D97706] hover:text-red-600 font-bold text-sm transition-colors flex items-center gap-1">
          View More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      
      <div className="relative">
        <div className="flex items-center gap-6">
          {totalPages > 1 && (
            <button onClick={prevSlide} className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow z-10 flex-shrink-0">
              <svg className="w-6 h-6 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
            {currentProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  title: product.name,
                  description: product.description,
                  price: `NPR ${product.price}`,
                  image: product.image ? `http://127.0.0.1:8000${product.image}` : 'https://via.placeholder.com/300'
                }} 
                featured={index === 2}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <button onClick={nextSlide} className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow z-10 flex-shrink-0">
              <svg className="w-6 h-6 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  index === currentIndex ? 'bg-[#D97706]' : 'bg-[#C0B8AF]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
