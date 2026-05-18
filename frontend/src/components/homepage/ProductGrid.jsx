import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { BASE } from "../../services/base";
const MEDIA = BASE.replace('/api', '');

export default function ProductGrid() {
  const [grids, setGrids] = useState([]);
  const [activeGrid, setActiveGrid] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/product-grids/`)
      .then(res => res.json())
      .then(data => {
        const grids = Array.isArray(data) ? data : (data.results ?? []);
        const gridPromises = grids.map(grid =>
          fetch(`${BASE}/products/?grid=${grid.id}`)
            .then(res => res.json())
            .then(products => {
              const list = Array.isArray(products) ? products : (products.results ?? []);
              return { ...grid, products: list };
            })
        );
        return Promise.all(gridPromises);
      })
      .then(gridsWithProducts => {
        setGrids(gridsWithProducts);
        if (gridsWithProducts.length > 0) setActiveGrid(gridsWithProducts[0].id);
      })
      .catch(() => {});
  }, []);

  const currentGrid = grids.find(g => g.id === activeGrid);
  const products = currentGrid?.products ?? [];

  return (
    <div className="bg-[#F0EDE5] py-16">
      <div className="max-w-[1200px] mx-auto px-4">

        {/* Header + tabs */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-[#D97706] text-xs font-bold tracking-widest uppercase mb-2"
               style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
              सामग्राहरू
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1B1917] leading-tight">
              The everyday <span className="text-[#D97706]">altar.</span>
            </h2>
            <p className="text-[#78716C] mt-2 max-w-sm text-sm leading-relaxed">
              From hand-hammered tama kalash to fresh saipatri garlands, every
              item is sourced from artisans we know by name.
            </p>
          </div>

          {/* Grid tabs */}
          {grids.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {grids.map(grid => (
                <button
                  key={grid.id}
                  onClick={() => setActiveGrid(grid.id)}
                  className={`px-5 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                    activeGrid === grid.id
                      ? "border-[#1B1917] bg-[#1B1917] text-white"
                      : "border-[#C0B8AF] text-[#78716C] hover:border-[#1B1917] hover:text-[#1B1917] bg-transparent"
                  }`}
                >
                  {grid.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <p className="text-[#78716C] text-center py-16">No products in this section.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  title: product.name,
                  description: product.description,
                  price: `NPR ${product.price}`,
                  image: product.image ? `${MEDIA}${product.image}` : 'https://via.placeholder.com/300',
                  tags: product.tags,
                }}
                featured={index === 2}
              />
            ))}
          </div>
        )}

        {/* Spiritual section */}
        <section className="mt-20">
          <div className="text-center mb-12" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1B1917] mb-4">
              आध्यात्मिक <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">ज्ञान र मार्गदर्शन</span>
            </h2>
            <p className="text-[#78716C] font-medium text-lg">Spiritual Insights and Guides</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
            {[
              { icon: "📖", title: "पूजा विधि (Puja Vidhi)", desc: "विभिन्न परम्परागत हिन्दू अनुष्ठान र पूजाहरूको विस्तृत चरणबद्ध मार्गदर्शन।", to: "/puja-vidhi" },
              { icon: "🕉️", title: "मन्त्र तथा श्लोक (Mantras)", desc: "पवित्र मन्त्रहरू, तिनको अर्थ र दैनिक जीवनमा उच्चारणको महत्त्व।", to: "/mantras" },
              { icon: "📅", title: "चाडपर्व क्यालेन्डर (Calendar)", desc: "वर्षभरिका महत्त्वपूर्ण चाडबाड, तिथि र उत्सवहरूको जानकारी।", to: "/calendar" },
            ].map(({ icon, title, desc, to }) => (
              <a key={title} href={to} className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)] transition-all duration-500 border border-[#F5F5F4] hover:-translate-y-2 group cursor-pointer text-center block">
                <div className="w-16 h-16 bg-orange-50 rounded-[16px] flex items-center justify-center mb-6 text-3xl mx-auto group-hover:scale-110 group-hover:bg-red-50 transition-all duration-500">{icon}</div>
                <h3 className="text-xl font-bold text-[#1B1917] mb-3 group-hover:text-red-600 transition-colors" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>{title}</h3>
                <p className="text-[#78716C] text-sm leading-relaxed">{desc}</p>
              </a>
            ))}

            {/* Live Hamro Patro small calendar */}
            <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F5F5F4] overflow-hidden flex flex-col items-center">
              <div className="px-4 pt-4 pb-2 text-center w-full">
                <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider" style={{fontFamily: 'Noto Sans Devanagari, sans-serif'}}>आजको पात्रो</p>
              </div>
              <iframe
                src="https://www.hamropatro.com/widgets/calender-small.php"
                frameBorder="0"
                scrolling="no"
                style={{ border: "none", width: "200px", height: "290px" }}
                allowTransparency="true"
                title="Nepali Calendar"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
