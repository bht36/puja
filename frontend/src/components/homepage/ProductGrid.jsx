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

        <section>
          <h2 className="text-3xl font-bold text-[#1E1C25] mb-8">Spiritual Insights and Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-[#C28142] rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl">📖</span>
              </div>
              <h3 className="text-xl font-bold text-[#1E1C25] mb-2">Puja Vidhi</h3>
              <p className="text-[#6B6560] text-sm">Step-by-step guides for traditional Hindu rituals</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-[#C28142] rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🕉️</span>
              </div>
              <h3 className="text-xl font-bold text-[#1E1C25] mb-2">Mantras</h3>
              <p className="text-[#6B6560] text-sm">Sacred chants and their meanings</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-[#C28142] rounded-lg flex items-center justify-center mb-4">
                <span className="text-white text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold text-[#1E1C25] mb-2">Festival Calendar</h3>
              <p className="text-[#6B6560] text-sm">Important dates and celebrations</p>
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
        <h2 className="text-3xl font-bold text-[#1E1C25]">{title}</h2>
        <button className="text-[#C28142] hover:text-[#94331F] font-medium transition-colors">
          View More →
        </button>
      </div>
      
      <div className="relative">
        <div className="flex items-center gap-6">
          {totalPages > 1 && (
            <button onClick={prevSlide} className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow z-10 flex-shrink-0">
              <svg className="w-6 h-6 text-[#C28142]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
