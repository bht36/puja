import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../homepage";
import { Search, Filter } from "lucide-react";

export default function CatalogPage() {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [filteredBundles, setFilteredBundles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/bundles/')
      .then(res => res.json())
      .then(data => {
        setBundles(data);
        setFilteredBundles(data);
      })
      .catch(err => console.error('Error fetching bundles:', err));
  }, []);

  const calculateBundlePrice = (bundle) => {
    if (!bundle.items || bundle.items.length === 0) return 0;
    return bundle.items.reduce((total, item) => total + parseFloat(item.price), 0);
  };

  useEffect(() => {
    let filtered = bundles.filter(bundle =>
      bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bundle.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === "price-low") filtered.sort((a, b) => calculateBundlePrice(a) - calculateBundlePrice(b));
    else if (sortBy === "price-high") filtered.sort((a, b) => calculateBundlePrice(b) - calculateBundlePrice(a));
    else if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredBundles(filtered);
  }, [searchTerm, sortBy, bundles]);

  return (
    <div className="min-h-screen bg-[#F0EDE5]">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-10" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-[1px] w-10 bg-red-400"></div>
            <span className="text-red-600 text-sm font-bold tracking-[0.15em] uppercase">पूजा संग्रह</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1B1917] mb-3 tracking-tight">
            पवित्र <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-red-600">पूजा सेटहरू</span>
          </h1>
          <p className="text-[#78716C] text-lg font-medium">Complete ritual sets for every sacred occasion</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E] w-5 h-5" />
            <input
              type="text"
              placeholder="Search sacred bundles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#E7E5E4] focus:outline-none focus:border-[#D97706]/60 focus:shadow-[0_0_0_3px_rgba(217,119,6,0.08)] text-[#1B1917] placeholder-[#A8A29E] transition-all font-medium shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="text-[#A8A29E] w-5 h-5 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3.5 rounded-2xl bg-white border border-[#E7E5E4] focus:outline-none focus:border-[#D97706]/60 text-[#1B1917] font-medium cursor-pointer shadow-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Bundle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredBundles.map((bundle) => (
            <div
              key={bundle.id}
              onClick={() => navigate(`/bundle/${bundle.id}`)}
              className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_40px_rgba(217,119,6,0.12)] hover:-translate-y-2 transition-all duration-500 cursor-pointer group border border-[#F5F5F4] flex flex-col"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden bg-[#FDFBF7]">
                {bundle.images && bundle.images.length > 0 ? (
                  <img
                    src={`http://127.0.0.1:8000${bundle.images[0].image}`}
                    alt={bundle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                    <span className="text-6xl">🙏</span>
                  </div>
                )}
                {/* Items badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-[#F5F5F4]">
                  <span className="text-xs font-bold text-[#78716C] uppercase tracking-wide">{bundle.items?.length || 0} items</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#1B1917] mb-2 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
                  {bundle.name}
                </h3>
                <p className="text-sm text-[#78716C] mb-5 line-clamp-2 leading-relaxed font-medium flex-1">{bundle.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mb-0.5">मूल्य (Price)</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-[#D97706]">NPR</span>
                      <span className="text-2xl font-extrabold text-[#D97706] tracking-tight">{calculateBundlePrice(bundle).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-2xl font-bold text-sm transition-all duration-300 border border-red-100 hover:border-red-600 hover:shadow-[0_8px_20px_rgb(239,68,68,0.25)]">
                    View Set →
                  </button>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="h-1 bg-gradient-to-r from-[#D97706] to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {filteredBundles.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🙏</div>
            <p className="text-[#78716C] text-lg font-medium">No sacred bundles found</p>
            <p className="text-[#A8A29E] text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
